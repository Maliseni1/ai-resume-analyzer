import { useAuthStore } from "~/lib/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account'},
])

const Auth = () => {
    const { user, isLoading, signIn, signUp, signInWithOAuth, signOut, checkAuthStatus } = useAuthStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get('next') ?? '/';
    const mode = new URLSearchParams(location.search).get('mode') ?? 'signup';
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(mode === 'signup');
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user) {
            navigate(next);
        }
    }, [user, next, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (isSignUp) {
            const { error } = await signUp(email, password);
            if (error) {
                setError(error.message);
            } else {
                setSuccessMsg("Check your email to confirm your account!");
                setIsSignUp(false);
            }
        } else {
            const { error } = await signIn(email, password);
            if (error) {
                setError(error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        const { error } = await signInWithOAuth("google");
        if (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>{isSignUp ? "Create an Account" : "Log In to Continue"}</h2>
                    </div>

                    <button 
                        onClick={handleGoogleSignIn}
                        className="secondary-button w-full"
                    >
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                            minLength={6}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
                        <button type="submit" className="primary-button">
                            {isSignUp ? "Sign Up" : "Log In"}
                        </button>
                    </form>

                    <button 
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                            setSuccessMsg(null);
                        }}
                        className="text-sm text-blue-600 underline"
                    >
                        {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                    </button>

                    {user && (
                        <button onClick={() => signOut()} className="secondary-button">
                            Log Out
                        </button>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Auth;