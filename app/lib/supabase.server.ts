import { createClient, type User } from "@supabase/supabase-js";

// Verifies the caller's Supabase access token server-side, so endpoints
// that don't touch the database directly (and therefore aren't protected
// by row-level security) still require a logged-in user — this is what
// keeps our shared Groq free-tier quota from being hit by anonymous
// requests to /api/analyze.
export async function requireUserFromRequest(request: Request): Promise<User | null> {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return null;

    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;

    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;

    return data.user;
}
