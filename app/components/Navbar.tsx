import { Link, useNavigate } from "react-router";
import { useAuthStore } from "~/lib/auth";
import { useThemeStore } from "~/lib/theme";
import { useEffect } from "react";

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
);

const Navbar = () => {
    const { user, checkAuthStatus, signOut } = useAuthStore();
    const { theme, init, toggleTheme } = useThemeStore();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
        init();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
    const initial = (user?.email ?? "?").charAt(0).toUpperCase();

    return (
        <nav className="navbar max-sm:px-4 max-sm:gap-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-4 shrink-0">
                <p className="text-lg sm:text-2xl font-bold text-white tracking-tight">RESUMIND</p>
            </Link>
            <div className="flex items-center gap-3 sm:gap-6">
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
                {user ? (
                    <>
                        <Link to="/dashboard" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <details className="user-menu relative">
                            <summary className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer list-none overflow-hidden bg-gold text-navy-dark font-semibold text-sm">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    initial
                                )}
                            </summary>
                            <div className="absolute right-0 mt-3 w-56 bg-surface rounded-2xl shadow-lg border border-line p-2 z-10">
                                <p className="px-3 py-2 text-sm text-ink-soft truncate">{user.email}</p>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-ink hover:bg-bg transition-colors cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </details>
                    </>
                ) : (
                    <>
                        <Link to="/signin" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/signup" className="navbar-cta text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
