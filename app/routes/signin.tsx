import { useAuthStore } from "~/lib/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Footer from "~/components/Footer";

export const meta = () => ([
    { title: 'Resumind | Sign In' },
])

const SignIn = () => {
    const { signIn, signInWithOAuth, checkAuthStatus, user } = useAuthStore();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const { error } = await signIn(email, password);
        setIsLoading(false);
        
        if (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        const { error } = await signInWithOAuth("google");
        if (error) {
            setError(error.message);
        }
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
            <nav className="navbar">
                <Link to="/" className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-gradient">RESUMIND</p>
                </Link>
            </nav>

            <div className="flex-1 flex items-center justify-center py-16">
                <div className="gradient-border shadow-lg">
                    <section className="flex flex-col gap-6 bg-white rounded-2xl p-10 max-w-md w-full">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1>Welcome Back</h1>
                            <h2>Sign in to your account</h2>
                        </div>

                        <button 
                            onClick={handleGoogleSignIn}
                            className="secondary-button w-full flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
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
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="primary-button" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500">
                            Don't have an account? <Link to="/signup" className="text-blue-600 underline">Sign up</Link>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default SignIn;