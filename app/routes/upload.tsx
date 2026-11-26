import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { useAuthStore } from "~/lib/auth";
import { getSupabaseClient } from "~/lib/supabase";
import { extractPdfText, renderPdfFirstPageToBlob } from "~/lib/pdf";
import { createResume, completeResumeAnalysis, failResumeAnalysis } from "~/lib/resumes";

export const meta = () => ([
    { title: "Upload Resume - Resumind" },
    { name: "description", content: "Upload your resume and get instant AI-powered feedback. Check ATS scores, tone, and content analysis." },
]);

const Upload = () => {
    const { user, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        if (selectedFile && selectedFile.type !== "application/pdf") {
            setError("Only PDF files are supported right now.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError(null);
        setStatus(null);
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!file) {
            setError("Please choose a PDF file before uploading.");
            return;
        }
        if (!user) {
            setError("Please sign in before uploading a resume.");
            return;
        }

        const supabase = getSupabaseClient();
        const id = crypto.randomUUID();
        let resumeCreated = false;

        setIsSubmitting(true);
        try {
            setStatus("Reading your resume...");
            const resumeText = await extractPdfText(file);
            if (resumeText.length < 20) {
                throw new Error(
                    "Couldn't find readable text in this PDF. Make sure it isn't a scanned image."
                );
            }

            setStatus("Generating a preview...");
            const previewBlob = await renderPdfFirstPageToBlob(file);

            setStatus("Uploading your resume...");
            const resumePath = `${user.id}/${id}/resume.pdf`;
            const imagePath = `${user.id}/${id}/image.png`;

            const { error: resumeUploadError } = await supabase.storage
                .from("resumes")
                .upload(resumePath, file, { contentType: "application/pdf" });
            if (resumeUploadError) throw resumeUploadError;

            const { error: imageUploadError } = await supabase.storage
                .from("resumes")
                .upload(imagePath, previewBlob, { contentType: "image/png" });
            if (imageUploadError) throw imageUploadError;

            await createResume(supabase, {
                id,
                userId: user.id,
                companyName: companyName || undefined,
                jobTitle: jobTitle || undefined,
                jobDescription: jobDescription || undefined,
                resumePath,
                imagePath,
            });
            resumeCreated = true;

            setStatus("Analyzing with AI...");
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;
            if (!accessToken) throw new Error("Your session expired. Please sign in again.");

            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ resumeText, jobTitle, jobDescription }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.error ?? "Analysis failed");
            }

            const { feedback } = await response.json();
            await completeResumeAnalysis(supabase, id, feedback);

            setStatus("Done! Redirecting...");
            navigate(`/resume/${id}`);
        } catch (err) {
            if (resumeCreated) {
                await failResumeAnalysis(supabase, id);
            }
            const message = err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
            setStatus(null);
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="main-section flex-1">
                <div className="page-heading py-16">
                    <h1>Upload a Resume</h1>
                    <h2>Drop your resume and let AI help you review it.</h2>
                </div>

                <div className="gradient-border shadow-lg p-8 bg-white rounded-3xl max-w-3xl mx-auto">
                    {authLoading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : !user ? (
                        <div className="text-center">
                            <p className="text-gray-500 mb-4">Please sign in to upload a resume.</p>
                            <Link to="/signup" className="primary-button inline-block">Sign Up Free</Link>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-6" onSubmit={handleUpload}>
                            <label className="flex flex-col gap-2">
                                <span className="font-semibold">Company name (optional)</span>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="input-field"
                                    disabled={isSubmitting}
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold">Job title (optional)</span>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="input-field"
                                    disabled={isSubmitting}
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold">Job description (optional)</span>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="min-h-[120px]"
                                    disabled={isSubmitting}
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold">Select a resume PDF</span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="file-input"
                                    disabled={isSubmitting}
                                />
                            </label>

                            <button type="submit" className="primary-button w-fit" disabled={isSubmitting}>
                                {isSubmitting ? "Working..." : "Upload Resume"}
                            </button>

                            {status && <p className="text-sm text-gray-600">{status}</p>}
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </form>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default Upload;
