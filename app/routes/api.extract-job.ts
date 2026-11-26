import type { Route } from "./+types/api.extract-job";
import { extractJobInfo } from "~/lib/groq.server";
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
    const text = typeof body?.text === "string" ? body.text : undefined;
    const imageDataUrl = typeof body?.imageDataUrl === "string" ? body.imageDataUrl : undefined;

    if (!text && !imageDataUrl) {
        return Response.json({ error: "text or imageDataUrl is required" }, { status: 400 });
    }

    try {
        const info = await extractJobInfo({ text, imageDataUrl });
        return Response.json(info);
    } catch (err) {
        console.error("api.extract-job failed:", err);
        const message = err instanceof Error ? err.message : "Extraction failed";
        const safeMessage = message.length > 200 ? "Extraction failed. Please try again." : message;
        return Response.json({ error: safeMessage }, { status: 502 });
    }
}
