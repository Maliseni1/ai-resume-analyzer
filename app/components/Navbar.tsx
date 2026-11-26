import { Link, useNavigate } from "react-router";
import { useAuthStore } from "~/lib/auth";
import { useEffect } from "react";

const Navbar = () => {
    const { user, checkAuthStatus, signOut } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
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
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg border border-line p-2 z-10">
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
