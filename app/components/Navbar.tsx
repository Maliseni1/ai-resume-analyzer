import { Link } from "react-router";
import { useAuthStore } from "~/lib/auth";
import { useEffect } from "react";

const Navbar = () => {
    const { user, isLoading, checkAuthStatus, signOut } = useAuthStore();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="flex items-center gap-4">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex items-center gap-4">
                {isLoading ? (
                    <span className="text-gray-400">Loading...</span>
                ) : user ? (
                    <>
                        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <button onClick={signOut} className="secondary-button">
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth?mode=signin" className="text-gray-600 hover:text-gray-900">
                            Sign In
                        </Link>
                        <Link to="/auth?mode=signup" className="primary-button w-fit">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;