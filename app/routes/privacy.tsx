import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const meta = () => ([
    { title: 'Privacy Policy - Resumind' },
    { name: "description", content: "How Resumind collects, uses, and protects your data." },
    { name: "robots", content: "noindex" },
]);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-ink-soft space-y-3">{children}</div>
    </div>
);

const Privacy = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="main-section flex-1">
                <div className="page-heading py-10">
                    <h1 className="text-4xl">Privacy Policy</h1>
                    <p className="text-ink-soft">Last updated: November 26, 2026</p>
                </div>

                <div className="gradient-border shadow-lg max-w-3xl mx-auto w-full">
                    <div className="bg-surface rounded-2xl p-8">
                        <p className="text-ink-soft">
                            Resumind ("we", "us", "our") is operated by Chiza Labs. This policy explains
                            what personal data we collect when you use Resumind, why we collect it, and
                            how you can control it.
                        </p>

                        <Section title="1. Information we collect">
                            <p><strong>Account data:</strong> your email address, and (if you sign in with
                            Google) your name and profile picture, provided by Supabase Authentication.</p>
                            <p><strong>Resume content:</strong> the resume files you upload (PDF/DOCX) and
                            any job title or company name you associate with them, so we can generate and
                            store AI feedback for you.</p>
                            <p><strong>Usage data:</strong> aggregate, anonymized analytics about pages
                            visited, collected via Vercel Analytics. We do not use this to identify you
                            individually.</p>
                        </Section>

                        <Section title="2. How we use your information">
                            <p>To create and secure your account, run your free trial, process your
                            resume through our AI analysis feature, show you your results, and
                            communicate with you about your account (e.g. email confirmation, trial
                            status).</p>
                            <p>We do not sell your personal data or your resume content to third parties,
                            and we do not use your resume content to train AI models.</p>
                        </Section>

                        <Section title="3. Third-party processors">
                            <p>We rely on the following service providers to operate Resumind. Each
                            processes a limited slice of your data under their own privacy and security
                            terms:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li><strong>Supabase</strong> — authentication, database, and file storage.</li>
                                <li><strong>Google OAuth</strong> — optional "Sign in with Google".</li>
                                <li><strong>An AI model provider</strong> — used to analyze the text/content
                                of resumes you upload in order to generate feedback.</li>
                                <li><strong>Vercel Analytics</strong> — anonymized, cookie-free usage
                                analytics.</li>
                            </ul>
                        </Section>

                        <Section title="4. Data retention">
                            <p>We retain your account and resume data for as long as your account is
                            active. You can delete individual resumes at any time, or request full
                            account deletion by emailing us (see Contact below), after which we delete
                            your data within 30 days except where retention is required by law.</p>
                        </Section>

                        <Section title="5. Your rights">
                            <p>Depending on where you live, you may have the right to access, correct,
                            export, or delete your personal data. Contact us to exercise these rights.</p>
                        </Section>

                        <Section title="6. Security">
                            <p>We use industry-standard safeguards (encrypted connections, access
                            controls, and managed infrastructure through Supabase) to protect your data.
                            No system is 100% secure, and we cannot guarantee absolute security.</p>
                        </Section>

                        <Section title="7. Children">
                            <p>Resumind is not directed at children under 16, and we do not knowingly
                            collect data from them.</p>
                        </Section>

                        <Section title="8. Changes to this policy">
                            <p>We may update this policy as Resumind evolves. We'll update the "Last
                            updated" date above when we do, and for material changes we'll notify you by
                            email.</p>
                        </Section>

                        <Section title="9. Contact">
                            <p>Questions about this policy? Email us at{" "}
                                <a href="mailto:hello@chizalabs.com" className="link">
                                    hello@chizalabs.com
                                </a>.
                            </p>
                        </Section>

                        <p className="text-xs text-ink-soft mt-10 border-t border-line pt-4">
                            This is a template policy intended for an early-stage, free product. Chiza
                            Labs has not had it reviewed by legal counsel. If you rely on this policy for
                            a production or paid launch, have it reviewed by a qualified professional for
                            your jurisdiction.
                        </p>
                    </div>
                </div>

                <Link to="/terms" className="link mt-6">
                    Read our Terms of Service
                </Link>
            </section>
            <Footer />
        </main>
    );
};

export default Privacy;
