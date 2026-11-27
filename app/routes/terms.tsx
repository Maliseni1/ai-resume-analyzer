import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const meta = () => ([
    { title: 'Terms of Service - Eukleya' },
    { name: "description", content: "The terms that govern your use of Eukleya." },
    { name: "robots", content: "noindex" },
]);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-ink-soft space-y-3">{children}</div>
    </div>
);

const Terms = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <section className="main-section flex-1">
                <div className="page-heading py-10">
                    <h1 className="text-4xl">Terms of Service</h1>
                    <p className="text-ink-soft">Last updated: November 26, 2026</p>
                </div>

                <div className="gradient-border shadow-lg max-w-3xl mx-auto w-full">
                    <div className="bg-surface rounded-2xl p-8">
                        <p className="text-ink-soft">
                            These Terms govern your use of Eukleya, a product operated by Chiza Labs.
                            By creating an account or using the service, you agree to these Terms.
                        </p>

                        <Section title="1. The service">
                            <p>Eukleya lets you upload a resume and receive AI-generated feedback on its
                            ATS compatibility, tone, structure, content, and skill matching. Eukleya is
                            offered on a free trial basis; paid plans, if introduced, will be described at
                            the time they become available.</p>
                        </Section>

                        <Section title="2. Accounts and free trial">
                            <p>You must provide an accurate email address to create an account. New
                            accounts receive a free trial. We may change the length or terms of the trial
                            with notice posted in-app. You're responsible for keeping your login
                            credentials secure.</p>
                        </Section>

                        <Section title="3. Acceptable use">
                            <p>Don't upload content you don't have the right to share, attempt to disrupt
                            or reverse-engineer the service, or use it to process another person's
                            personal data without their consent.</p>
                        </Section>

                        <Section title="4. AI-generated feedback">
                            <p>Feedback is generated automatically by an AI model and is provided for
                            informational purposes only. It is not professional career, legal, or hiring
                            advice, and we don't guarantee its accuracy or that it will improve your job
                            prospects.</p>
                        </Section>

                        <Section title="5. Your content">
                            <p>You retain ownership of the resumes and content you upload. You grant us a
                            limited license to store and process that content solely to provide the
                            service to you, as described in our{" "}
                                <Link to="/privacy" className="link">Privacy Policy</Link>.
                            </p>
                        </Section>

                        <Section title="6. Service availability">
                            <p>Eukleya is an early-stage product run on free/low-cost infrastructure
                            tiers. We don't guarantee uninterrupted availability and may modify or
                            discontinue features with reasonable notice.</p>
                        </Section>

                        <Section title="7. Termination">
                            <p>You may stop using Eukleya and delete your account at any time. We may
                            suspend or terminate accounts that violate these Terms.</p>
                        </Section>

                        <Section title="8. Disclaimer and limitation of liability">
                            <p>Eukleya is provided "as is" without warranties of any kind. To the maximum
                            extent permitted by law, Chiza Labs is not liable for indirect, incidental, or
                            consequential damages arising from your use of the service.</p>
                        </Section>

                        <Section title="9. Changes to these terms">
                            <p>We may update these Terms as the product evolves. Continued use after an
                            update means you accept the revised Terms.</p>
                        </Section>

                        <Section title="10. Contact">
                            <p>Questions about these Terms? Email{" "}
                                <a href="mailto:hello@chizalabs.com" className="link">
                                    hello@chizalabs.com
                                </a>.
                            </p>
                        </Section>

                        <p className="text-xs text-ink-soft mt-10 border-t border-line pt-4">
                            This is a template agreement intended for an early-stage, free product. Chiza
                            Labs has not had it reviewed by legal counsel. If you rely on these Terms for
                            a production or paid launch, have them reviewed by a qualified professional
                            for your jurisdiction.
                        </p>
                    </div>
                </div>

                <Link to="/privacy" className="link mt-6">
                    Read our Privacy Policy
                </Link>
            </section>
            <Footer />
        </main>
    );
};

export default Terms;
