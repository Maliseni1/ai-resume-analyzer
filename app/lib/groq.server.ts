import Groq from "groq-sdk";

// Server-only: GROQ_API_KEY must never carry the VITE_ prefix, or Vite would
// inline it into the client bundle. The `.server.ts` suffix also tells
// React Router to strip this module out of the client build entirely.

const MODEL = "llama-3.3-70b-versatile";

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
}

function assertFeedbackShape(value: unknown): value is Feedback {
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
