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
        console.error("api.analyze failed:", err);
        // Defense in depth: never forward an unbounded/raw internal error
        // message to the client, even if something upstream didn't clean
        // its own error before throwing.
        const message = err instanceof Error ? err.message : "Analysis failed";
        const safeMessage = message.length > 200 ? "Analysis failed. Please try again." : message;
        return Response.json({ error: safeMessage }, { status: 502 });
    }
}
