import { useEffect, useState } from "react";
import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import ConfirmDialog from "~/components/ConfirmDialog";
import { getSupabaseClient } from "~/lib/supabase";
import { getSignedResumeUrl, deleteResume } from "~/lib/resumes";
import { useToastStore } from "~/lib/toast";

const statusLabel: Record<ResumeStatus, string> = {
    pending: "Queued...",
    processing: "Analyzing...",
    completed: "",
    failed: "Analysis failed",
};

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
        <path d="M10 11v6M14 11v6" />
    </svg>
);

const ResumeCard = ({resume, onDeleted}: {resume: Resume; onDeleted?: (id: string) => void}) => {
    const { id, companyName, jobTitle, feedback, imagePath, resumePath, status } = resume;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const addToast = useToastStore((state) => state.addToast);

    useEffect(() => {
        if (!imagePath) return;
        getSignedResumeUrl(getSupabaseClient(), imagePath).then(setImageUrl);
    }, [imagePath]);

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteResume(getSupabaseClient(), { id, resumePath, imagePath });
            addToast("Resume deleted", "success");
            onDeleted?.(id);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete resume.";
            addToast(message, "error");
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
        <Link to={`/resume/${id}`} className="resume-card relative animate-in fade-in duration-1000   ">
            <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-label="Delete resume"
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-line text-ink-soft hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer disabled:opacity-50"
            >
                <TrashIcon />
            </button>
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-ink font-bold break-words">{companyName || "Untitled"}</h2>
                    <h3 className="text-lg break-words text-ink-soft">{jobTitle}</h3>
                </div>
                <div className="flex-shrink-0">
                    {status === "completed" && feedback ? (
                        <ScoreCircle score={feedback.overallScore} />
                    ) : (
                        <span className="text-sm text-ink-soft">{statusLabel[status]}</span>
                    )}
                </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="resume"
                            className="w-full h-[350px] max-sm:h[200px] object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-[350px] max-sm:h[200px] bg-bg" />
                    )}
                </div>
            </div>
        </Link>
        <ConfirmDialog
            open={showConfirm}
            title="Delete this resume?"
            message={`This will permanently delete the resume for "${companyName || "Untitled"}". This can't be undone.`}
            confirmLabel="Delete"
            isConfirming={isDeleting}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowConfirm(false)}
        />
        </>
    )
}

export default ResumeCard
