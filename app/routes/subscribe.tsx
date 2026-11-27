import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const meta = () => ([
    { title: 'Subscribe - Eukleya' },
    { name: "description", content: "Eukleya paid plans are coming soon." },
    { name: "robots", content: "noindex" },
]);

const Subscribe = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="main-section flex-1 flex items-center justify-center">
                <div className="gradient-border shadow-lg bg-surface rounded-3xl p-10 max-w-xl mx-auto text-center">
                    <h1>Paid plans are coming soon</h1>
                    <p className="text-ink-soft mt-4">
                        We're still building out subscriptions. In the meantime, reach out to{" "}
                        <a href="mailto:hello@chizalabs.com" className="link">
                            hello@chizalabs.com
                        </a>{" "}
                        if you'd like continued access.
                    </p>
                    <Link to="/dashboard" className="primary-button mt-6 inline-block">
                        Back to dashboard
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default Subscribe;
