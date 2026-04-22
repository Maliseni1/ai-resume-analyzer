import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="flex items-center gap-4">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex items-center gap-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                    Home
                </Link>
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;