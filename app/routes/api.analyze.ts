import type { Route } from "./+types/api.analyze";
import { analyzeResume } from "~/lib/groq.server";
import { requireUserFromRequest } from "~/lib/supabase.server";

export async function action({ request }: Route.ActionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const user = await requireUserFromRequest(request);
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const resumeText = typeof body?.resumeText === "string" ? body.resumeText : null;
    if (!resumeText) {
        return Response.json({ error: "resumeText is required" }, { status: 400 });
    }

    try {
        const feedback = await analyzeResume({
            resumeText,
            jobTitle: typeof body?.jobTitle === "string" ? body.jobTitle : undefined,
            jobDescription:
                typeof body?.jobDescription === "string" ? body.jobDescription : undefined,
        });
        return Response.json({ feedback });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Analysis failed";
        return Response.json({ error: message }, { status: 502 });
    }
}
