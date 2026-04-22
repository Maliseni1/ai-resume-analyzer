import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/lib/auth";

export const meta = () => ([
    { title: 'Resumind | Auth Callback' },
])

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user, checkAuthStatus } = useAuthStore();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/');
        } else {
            navigate('/auth');
        }
    }, [user, navigate]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <p>Signing you in...</p>
        </main>
    );
};

export default AuthCallback;