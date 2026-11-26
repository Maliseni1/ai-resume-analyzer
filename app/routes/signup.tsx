import { useAuthStore } from "~/lib/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Footer from "~/components/Footer";
import FloatingInput from "~/components/FloatingInput";
import { useToastStore } from "~/lib/toast";

export const meta = () => ([
    { title: 'Sign Up - Resumind' },
    { name: "description", content: "Create your free Resumind account and get 3 days of AI-powered resume analysis. No credit card required." },
    { name: "robots", content: "noindex" },
])

const SignUp = () => {
    const { signUp, signInWithOAuth, checkAuthStatus } = useAuthStore();
    const addToast = useToastStore((state) => state.addToast);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
    const canSubmit = password.length >= 6 && confirmPassword.length > 0 && !passwordsMismatch;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addToast("Passwords do not match", "error");
            return;
        }

        if (password.length < 6) {
            addToast("Password must be at least 6 characters", "error");
            return;
        }

        setIsLoading(true);
        const { error } = await signUp(email, password);
        setIsLoading(false);

        if (error) {
            addToast(error.message, "error");
        } else {
            addToast("Check your email to confirm your account!", "success");
        }
    };

    const handleGoogleSignUp = async () => {
        const { error } = await signInWithOAuth("google");
        if (error) {
            addToast(error.message, "error");
        }
    };

    return (
        <main className="min-h-screen flex flex-col">
            <nav className="navbar">
                <Link to="/" className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-white">RESUMIND</p>
                </Link>
            </nav>

            <div className="flex-1 flex items-center justify-center py-16 px-4">
                <div className="gradient-border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="flex flex-col gap-6 bg-surface rounded-2xl p-6 sm:p-10 max-w-md w-full">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1>Create Account</h1>
                            <h2>Start your 3-day free trial</h2>
                        </div>

                        <button 
                            onClick={handleGoogleSignUp}
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
                            <div className="flex-1 h-px bg-line" />
                            <span className="text-sm text-ink-soft">or</span>
                            <div className="flex-1 h-px bg-line" />
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <FloatingInput
                                id="signup-email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <FloatingInput
                                id="signup-password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-ink-soft -mt-2">Minimum 6 characters</p>
                            <FloatingInput
                                id="signup-confirm-password"
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {passwordsMismatch && <p className="text-red-500 text-sm -mt-2">Passwords do not match</p>}
                            <button type="submit" className="primary-button" disabled={isLoading || !canSubmit}>
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-ink-soft">
                            Already have an account? <Link to="/signin" className="link">Sign in</Link>
                        </p>
                        <p className="text-center text-xs text-ink-soft">
                            By signing up, you agree to our{" "}
                            <Link to="/terms" className="link">Terms of Service</Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="link">Privacy Policy</Link>.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default SignUp;