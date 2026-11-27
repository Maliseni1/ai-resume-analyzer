import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import ScoreCircle from "~/components/ScoreCircle";
import { useAuthStore } from "~/lib/auth";
import { getSupabaseClient } from "~/lib/supabase";
import { getResumeById, getSignedResumeUrl } from "~/lib/resumes";
import { defaultMeta } from "~/lib/site";

export const meta = () => ([
    { title: "Resume Analysis - Eukleya" },
    { name: "description", content: "View detailed AI feedback on your resume. See ATS scores, tone analysis, content tips, and skill matching." },
    { name: "robots", content: "noindex" },
    ...defaultMeta(),
]);

const POLL_INTERVAL_MS = 4000;

const Resume = () => {
    const params = useParams();
    const { user, isLoading: authLoading, checkAuthStatus } = useAuthStore();
    const navigate = useNavigate();

    const [resume, setResume] = useState<Resume | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate(`/signin?next=/resume/${params.id}`);
        }
    }, [authLoading, user, navigate, params.id]);

    useEffect(() => {
        if (!user || !params.id) return;

        let cancelled = false;
        const supabase = getSupabaseClient();

        const load = async () => {
            const result = await getResumeById(supabase, params.id!);
            if (cancelled) return;
            setResume(result);
            setLoading(false);
            if (result?.imagePath) {
                getSignedResumeUrl(supabase, result.imagePath).then((url) => {
                    if (!cancelled) setImageUrl(url);
                });
            }
        };

        load();

        const interval = setInterval(() => {
            if (resume && (resume.status === "pending" || resume.status === "processing")) {
                load();
            }
        }, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [user, params.id, resume?.status]);

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <section className="main-section py-24 text-center flex-1">
                    <p className="text-ink-soft">Loading...</p>
                </section>
                <Footer />
            </main>
        );
    }

    if (!resume) {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <section className="main-section py-24 text-center flex-1">
                    <div className="gradient-border shadow-lg bg-surface rounded-3xl p-10 max-w-xl mx-auto">
                        <h1>Resume not found</h1>
                        <p className="text-ink-soft mt-4">We couldn't find the resume you're looking for.</p>
                        <Link to="/dashboard" className="primary-button mt-6 inline-block">
                            Back to dashboard
                        </Link>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    if (resume.status === "pending" || resume.status === "processing") {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <section className="main-section py-24 text-center flex-1">
                    <div className="gradient-border shadow-lg bg-surface rounded-3xl p-10 max-w-xl mx-auto">
                        <h1>Analyzing your resume...</h1>
                        <p className="text-ink-soft mt-4">This usually takes a few seconds. This page will update automatically.</p>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    if (resume.status === "failed" || !resume.feedback) {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <section className="main-section py-24 text-center flex-1">
                    <div className="gradient-border shadow-lg bg-surface rounded-3xl p-10 max-w-xl mx-auto">
                        <h1>Analysis failed</h1>
                        <p className="text-ink-soft mt-4">Something went wrong analyzing this resume. Please try uploading it again.</p>
                        <Link to="/upload" className="primary-button mt-6 inline-block">
                            Upload a new resume
                        </Link>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    const { companyName, jobTitle, feedback } = resume;
    const sections = [
        { title: "ATS", data: feedback.ATS },
        { title: "Tone & Style", data: feedback.toneAndStyle },
        { title: "Content", data: feedback.content },
        { title: "Structure", data: feedback.structure },
        { title: "Skills", data: feedback.skills },
    ];

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="main-section py-16 flex-1">
                <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-ink-soft">Resume Review</p>
                                    <h1 className="text-3xl sm:text-4xl font-bold break-words">{companyName || "Untitled"}</h1>
                                    <p className="text-lg text-ink-soft">{jobTitle}</p>
                                </div>
                                <ScoreCircle score={feedback.overallScore} />
                            </div>
                        </div>

                        {imageUrl && (
                            <div className="gradient-border rounded-3xl overflow-hidden shadow-lg">
                                <img src={imageUrl} alt="Resume preview" className="w-full h-[370px] object-cover" />
                            </div>
                        )}

                        <div className="grid gap-6">
                            {sections.map((section) => (
                                <div key={section.title} className="bg-surface rounded-3xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold">{section.title}</h2>
                                        <span className="text-sm text-ink-soft">Score {section.data.score}</span>
                                    </div>
                                    <div className="space-y-4">
                                        {section.data.tips.map((tip, index) => (
                                            <div key={index} className="rounded-2xl border border-line p-4">
                                                <p className="font-semibold">{tip.tip}</p>
                                                {"explanation" in tip && <p className="text-sm text-ink-soft mt-2">{(tip as { explanation: string }).explanation}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-surface rounded-3xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Resume Actions</h2>
                            <Link to="/upload" className="primary-button w-full text-center">
                                Upload a new resume
                            </Link>
                            <Link to="/dashboard" className="mt-4 block text-center link">
                                Back to dashboard
                            </Link>
                        </div>

                        <div className="bg-surface rounded-3xl p-6 shadow-sm">
                            <h3 className="font-semibold">Tips</h3>
                            <p className="text-sm text-ink-soft mt-3">
                                Use this page to compare scores across categories and see where your resume can improve.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default Resume;
