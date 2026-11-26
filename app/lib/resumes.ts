import type { SupabaseClient } from "@supabase/supabase-js";

interface ResumeRow {
    id: string;
    user_id: string;
    company_name: string | null;
    job_title: string | null;
    job_description: string | null;
    resume_path: string;
    image_path: string | null;
    status: ResumeStatus;
    feedback: Feedback | null;
    created_at: string;
}

function mapRow(row: ResumeRow): Resume {
    return {
        id: row.id,
        companyName: row.company_name ?? undefined,
        jobTitle: row.job_title ?? undefined,
        jobDescription: row.job_description ?? undefined,
        imagePath: row.image_path,
        resumePath: row.resume_path,
        status: row.status,
        feedback: row.feedback,
    };
}

export async function listUserResumes(
    supabase: SupabaseClient,
    userId: string
): Promise<Resume[]> {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ResumeRow[]).map(mapRow);
}

export async function getResumeById(
    supabase: SupabaseClient,
    id: string
): Promise<Resume | null> {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data ? mapRow(data as ResumeRow) : null;
}

export interface CreateResumeInput {
    id: string;
    userId: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    resumePath: string;
    imagePath: string | null;
}

export async function createResume(
    supabase: SupabaseClient,
    input: CreateResumeInput
): Promise<void> {
    const { error } = await supabase.from("resumes").insert({
        id: input.id,
        user_id: input.userId,
        company_name: input.companyName ?? null,
        job_title: input.jobTitle ?? null,
        job_description: input.jobDescription ?? null,
        resume_path: input.resumePath,
        image_path: input.imagePath,
        status: "processing",
    });

    if (error) throw error;
}

export async function completeResumeAnalysis(
    supabase: SupabaseClient,
    id: string,
    feedback: Feedback
): Promise<void> {
    const { error } = await supabase
        .from("resumes")
        .update({ feedback, status: "completed" })
        .eq("id", id);

    if (error) throw error;
}

export async function failResumeAnalysis(
    supabase: SupabaseClient,
    id: string
): Promise<void> {
    await supabase.from("resumes").update({ status: "failed" }).eq("id", id);
}

export async function getSignedResumeUrl(
    supabase: SupabaseClient,
    path: string | null
): Promise<string | null> {
    if (!path) return null;

    const { data, error } = await supabase.storage
        .from("resumes")
        .createSignedUrl(path, 60 * 60);

    if (error) return null;
    return data.signedUrl;
}
