import { useEffect, useState } from "react";
import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { getSupabaseClient } from "~/lib/supabase";
import { getSignedResumeUrl } from "~/lib/resumes";

const statusLabel: Record<ResumeStatus, string> = {
    pending: "Queued...",
    processing: "Analyzing...",
    completed: "",
    failed: "Analysis failed",
};

const ResumeCard = ({resume: {id, companyName, jobTitle, feedback, imagePath, status} }: {resume: Resume}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!imagePath) return;
        getSignedResumeUrl(getSupabaseClient(), imagePath).then(setImageUrl);
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000   ">
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
    )
}

export default ResumeCard
