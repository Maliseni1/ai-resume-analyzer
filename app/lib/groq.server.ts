import Groq from "groq-sdk";

// Server-only: GROQ_API_KEY must never carry the VITE_ prefix, or Vite would
// inline it into the client bundle. The `.server.ts` suffix also tells
// React Router to strip this module out of the client build entirely.

const MODEL = "openai/gpt-oss-120b";
const VISION_MODEL = "qwen/qwen3.8-27b";

let client: Groq | null = null;

function getClient() {
    if (client) return client;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY environment variable");
    }

    client = new Groq({ apiKey });
    return client;
}

const SYSTEM_PROMPT = `You are an expert resume reviewer and ATS (Applicant
Tracking System) specialist. You will be given the raw text of a resume, and
optionally a target job title and job description.

Analyze the resume and respond with ONLY a single JSON object, no prose
before or after it, matching exactly this shape:

{
  "overallScore": number (0-100),
  "ATS": { "score": number (0-100), "tips": [{ "type": "good" | "improve", "tip": string }] },
  "toneAndStyle": { "score": number (0-100), "tips": [{ "type": "good" | "improve", "tip": string, "explanation": string }] },
  "content": { "score": number (0-100), "tips": [{ "type": "good" | "improve", "tip": string, "explanation": string }] },
  "structure": { "score": number (0-100), "tips": [{ "type": "good" | "improve", "tip": string, "explanation": string }] },
  "skills": { "score": number (0-100), "tips": [{ "type": "good" | "improve", "tip": string, "explanation": string }] }
}

Give 3-5 tips per category, a mix of "good" (what's already working) and
"improve" (concrete, actionable fixes). Be specific to the resume's actual
content, not generic advice. If a job title or job description is provided,
weigh "skills" and "content" against how well the resume matches it.`;

export interface AnalyzeResumeInput {
    resumeText: string;
    jobTitle?: string;
    jobDescription?: string;
}

const MAX_ATTEMPTS = 2;

export async function analyzeResume({
    resumeText,
    jobTitle,
    jobDescription,
}: AnalyzeResumeInput): Promise<Feedback> {
    const groq = getClient();

    const userPrompt = [
        jobTitle ? `Target job title: ${jobTitle}` : null,
        jobDescription ? `Job description:\n${jobDescription}` : null,
        `Resume text:\n${resumeText}`,
    ]
        .filter(Boolean)
        .join("\n\n");

    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const completion = await groq.chat.completions.create({
                model: MODEL,
                temperature: 0.4,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userPrompt },
                ],
            });

            const raw = completion.choices[0]?.message?.content;
            if (!raw) {
                throw new Error("Groq returned an empty response");
            }

            const feedback = JSON.parse(raw) as Feedback;
            assertFeedbackShape(feedback);
            return feedback;
        } catch (err) {
            // Never let a provider error (which can embed the model's raw,
            // unfinished output -- e.g. Groq's `failed_generation` field on
            // a json_validate_failed error) reach the client. Log the real
            // details server-side and retry once; this class of failure is
            // usually transient.
            lastError = err;
            console.error(`analyzeResume attempt ${attempt} failed:`, err);
        }
    }

    throw new Error(
        lastError instanceof SyntaxError
            ? "The AI returned a response we couldn't read. Please try again."
            : "Resume analysis failed. Please try again in a moment."
    );
}

const JOB_EXTRACT_SYSTEM_PROMPT = `You extract structured information from a
job posting, given either as raw text or an image of the posting. Respond
with ONLY a single JSON object, no prose before or after it, matching
exactly this shape:

{
  "companyName": string | null,
  "jobTitle": string | null,
  "jobDescription": string
}

"jobDescription" should be the full body of the posting (responsibilities,
requirements, qualifications) cleaned into plain readable text -- omit
navigation, boilerplate, and "how to apply" instructions. Use null for
companyName or jobTitle if you genuinely can't find them. Always include a
jobDescription, summarizing if necessary.`;

export interface ExtractJobInfoInput {
    text?: string;
    imageDataUrl?: string;
}

export interface ExtractedJobInfo {
    companyName?: string;
    jobTitle?: string;
    jobDescription: string;
}

export async function extractJobInfo({ text, imageDataUrl }: ExtractJobInfoInput): Promise<ExtractedJobInfo> {
    if (!text && !imageDataUrl) {
        throw new Error("Provide either text or an image to extract from.");
    }

    const groq = getClient();
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const completion = await groq.chat.completions.create({
                model: imageDataUrl ? VISION_MODEL : MODEL,
                temperature: 0.2,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: JOB_EXTRACT_SYSTEM_PROMPT },
                    imageDataUrl
                        ? {
                              role: "user",
                              content: [
                                  { type: "text", text: "Extract the job posting details from this image." },
                                  { type: "image_url", image_url: { url: imageDataUrl } },
                              ],
                          }
                        : { role: "user", content: `Job posting text:\n${text}` },
                ],
            });

            const raw = completion.choices[0]?.message?.content;
            if (!raw) {
                throw new Error("Groq returned an empty response");
            }

            return assertJobInfoShape(JSON.parse(raw));
        } catch (err) {
            lastError = err;
            console.error(`extractJobInfo attempt ${attempt} failed:`, err);
        }
    }

    throw new Error(
        lastError instanceof SyntaxError
            ? "The AI returned a response we couldn't read. Please try again."
            : "Couldn't read that file. Please try again or fill the form in manually."
    );
}

export function assertJobInfoShape(value: unknown): ExtractedJobInfo {
    const v = value as Partial<ExtractedJobInfo> | null;
    if (!v || typeof v.jobDescription !== "string") {
        throw new Error("Groq response is missing jobDescription");
    }
    return {
        companyName: typeof v.companyName === "string" ? v.companyName : undefined,
        jobTitle: typeof v.jobTitle === "string" ? v.jobTitle : undefined,
        jobDescription: v.jobDescription,
    };
}

export function assertFeedbackShape(value: unknown): value is Feedback {
    const categories = ["ATS", "toneAndStyle", "content", "structure", "skills"] as const;
    const v = value as Partial<Feedback> | null;

    if (!v || typeof v.overallScore !== "number") {
        throw new Error("Groq response is missing overallScore");
    }
    for (const category of categories) {
        const section = v[category];
        if (!section || typeof section.score !== "number" || !Array.isArray(section.tips)) {
            throw new Error(`Groq response is missing or malformed section: ${category}`);
        }
    }
    return true;
}
