import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-2 text-center text-gray-500 text-sm">
                <p>Built by <span className="font-semibold text-gray-700">Chiza Labs</span> &copy; 2026</p>
                <div className="flex items-center gap-4">
                    <Link to="/privacy" className="hover:text-gray-700 underline">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-gray-700 underline">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;