import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { useAuthStore } from "~/lib/auth";
import { getSupabaseClient } from "~/lib/supabase";
import { extractPdfText, renderPdfFirstPageToBlob } from "~/lib/pdf";
import { extractDocxText } from "~/lib/docx";
import { fileToDataUrl } from "~/lib/fileToDataUrl";
import { createResume, completeResumeAnalysis, failResumeAnalysis } from "~/lib/resumes";
import { useToastStore } from "~/lib/toast";
import FloatingInput from "~/components/FloatingInput";
import FloatingTextarea from "~/components/FloatingTextarea";
import LoadingOverlay from "~/components/LoadingOverlay";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_JOB_FILE_BYTES = 4 * 1024 * 1024; // keep comfortably under serverless body-size limits

export const meta = () => ([
    { title: "Upload Resume - Eukleya" },
    { name: "description", content: "Upload your resume and get instant AI-powered feedback. Check ATS scores, tone, and content analysis." },
]);

const Upload = () => {
    const { user, isLoading: authLoading } = useAuthStore();
    const addToast = useToastStore((state) => state.addToast);
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [extractionStatus, setExtractionStatus] = useState<string | null>(null);

    const handleJobFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const jobFile = event.target.files?.[0] ?? null;
        event.target.value = ""; // allow re-selecting the same file again later

        if (!jobFile) return;

        if (jobFile.size > MAX_JOB_FILE_BYTES) {
            addToast("That file is too large (max 4MB). Try a smaller file, or paste the text in manually.", "error");
            return;
        }

        setExtractionStatus("Reading your file...");
        try {
            let body: { text?: string; imageDataUrl?: string };

            if (jobFile.type === "application/pdf") {
                body = { text: await extractPdfText(jobFile) };
            } else if (jobFile.type === DOCX_MIME) {
                body = { text: await extractDocxText(jobFile) };
            } else if (jobFile.type.startsWith("image/")) {
                body = { imageDataUrl: await fileToDataUrl(jobFile) };
            } else {
                addToast("Unsupported file type. Use a PDF, DOCX, or image.", "error");
                setExtractionStatus(null);
                return;
            }

            if (body.text !== undefined && body.text.trim().length < 20) {
                throw new Error("Couldn't find readable text in that file.");
            }

            setExtractionStatus("Extracting job details with AI...");
            const supabase = getSupabaseClient();
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;
            if (!accessToken) throw new Error("Your session expired. Please sign in again.");

            const response = await fetch("/api/extract-job", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const resBody = await response.json().catch(() => null);
                throw new Error(resBody?.error ?? "Extraction failed");
            }

            const info = await response.json();
            if (info.companyName) setCompanyName(info.companyName);
            if (info.jobTitle) setJobTitle(info.jobTitle);
            if (info.jobDescription) setJobDescription(info.jobDescription);

            addToast("Form filled in from your file!", "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Couldn't read that file.";
            addToast(message, "error");
        } finally {
            setExtractionStatus(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        if (selectedFile && selectedFile.type !== "application/pdf") {
            addToast("Only PDF files are supported right now.", "error");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setStatus(null);
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            addToast("Please choose a PDF file before uploading.", "error");
            return;
        }
        if (!user) {
            addToast("Please sign in before uploading a resume.", "error");
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
            addToast("Resume analyzed successfully!", "success");
            navigate(`/resume/${id}`);
        } catch (err) {
            if (resumeCreated) {
                await failResumeAnalysis(supabase, id);
            }
            const message = err instanceof Error ? err.message : "Something went wrong.";
            addToast(message, "error");
            setStatus(null);
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="main-section flex-1">
                <div className="page-heading py-8">
                    <h1>Upload a Resume/Curriculum Vitae</h1>
                    <h2>Drop your resume and let AI help you review it.</h2>
                </div>

                <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 max-w-5xl mx-auto w-full items-start">
                    <div className="gradient-border shadow-lg p-8 bg-surface rounded-3xl">
                        {authLoading ? (
                            <p className="text-center text-ink-soft">Loading...</p>
                        ) : !user ? (
                            <div className="text-center">
                                <p className="text-ink-soft mb-4">Please sign in to upload a resume.</p>
                                <Link to="/signup" className="primary-button inline-block">Sign Up Free</Link>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-4" onSubmit={handleUpload}>
                                <p className="text-sm text-ink-soft -mb-2">
                                    Company, job title, and job description are optional, but adding them helps the AI tailor its feedback.
                                </p>

                                <label className="flex flex-col gap-2 border border-dashed border-line rounded-2xl p-4 bg-bg cursor-pointer">
                                    <span className="font-semibold text-sm text-ink">
                                        Have the job posting saved? Auto-fill the fields below
                                    </span>
                                    <span className="text-xs text-ink-soft">
                                        Upload it as a PDF, DOCX, or image (e.g. a screenshot) and the AI will pull
                                        out the company, job title, and description for you.
                                    </span>
                                    <input
                                        type="file"
                                        accept="application/pdf,.pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                        onChange={handleJobFileChange}
                                        className="file-input"
                                        disabled={extractionStatus !== null || isSubmitting}
                                    />
                                </label>

                                <FloatingInput
                                    id="upload-company-name"
                                    label="Company name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    disabled={isSubmitting}
                                />

                                <FloatingInput
                                    id="upload-job-title"
                                    label="Job title"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    disabled={isSubmitting}
                                />

                                <FloatingTextarea
                                    id="upload-job-description"
                                    label="Job description"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    disabled={isSubmitting}
                                />

                                <label className="flex flex-col gap-2 mt-2">
                                    <span className="font-semibold text-sm">Select a Resume/CV PDF</span>
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
                            </form>
                        )}
                    </div>

                    <aside className="bg-surface border border-line rounded-3xl p-6 space-y-5">
                        <div>
                            <h3 className="font-semibold text-ink">Not sure what to put here?</h3>
                            <p className="text-sm text-ink-soft mt-1">
                                These are optional, but the more the AI knows about the role, the more
                                specific its feedback will be. Here's an example of a well-filled form:
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Company name</p>
                            <p className="text-sm text-ink bg-bg rounded-lg px-3 py-2">Acme Corporation</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Job title</p>
                            <p className="text-sm text-ink bg-bg rounded-lg px-3 py-2">Senior Frontend Developer</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Job description</p>
                            <p className="text-sm text-ink bg-bg rounded-lg px-3 py-2">
                                We're looking for a Frontend Developer with 3+ years of React experience,
                                strong CSS/accessibility skills, and experience integrating REST APIs.
                                Bonus: TypeScript and testing experience.
                            </p>
                        </div>

                        <p className="text-xs text-ink-soft">
                            Tip: paste the job description straight from the listing -- the closer it
                            matches the real posting, the better the skills/content feedback will be.
                        </p>
                    </aside>
                </div>
            </section>
            <Footer />
            {extractionStatus && <LoadingOverlay message={extractionStatus} />}
            {isSubmitting && status && <LoadingOverlay message={status} />}
        </main>
    );
};

export default Upload;
