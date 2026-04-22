import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSupabaseClient } from "~/lib/supabase";

export const meta = () => ([
    { title: 'Resumind | Auth Callback' },
])

const AuthCallback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Signing you in...");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = getSupabaseClient();
                
                // Supabase handles the OAuth code exchange automatically
                // We just need to check if the user is now authenticated
                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error) {
                    console.error("Auth callback error:", error);
                    setStatus("Sign in failed. Please try again.");
                    setTimeout(() => navigate('/signin'), 2000);
                    return;
                }
                
                if (user) {
                    setStatus("Success! Redirecting...");
                    setTimeout(() => navigate('/dashboard'), 500);
                } else {
                    setStatus("No user found. Redirecting...");
                    setTimeout(() => navigate('/signin'), 2000);
                }
            } catch (err) {
                console.error("Callback error:", err);
                setStatus("An error occurred.");
                setTimeout(() => navigate('/signin'), 2000);
            }
        };
        
        handleCallback();
    }, []);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl">{status}</p>
            </div>
        </main>
    );
};

export default AuthCallback;