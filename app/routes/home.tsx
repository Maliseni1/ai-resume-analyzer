import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Link } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eukleya - AI Resume Analyzer | Free 3-Day Trial" },
    { name: "description", content: "Let your work speak well of you. Get instant AI-powered feedback on your resume -- ATS score, tone, structure, and content. Start your free 3-day trial today!" },
    { name: "keywords", content: "resume analyzer, AI resume review, ATS score, job application, resume feedback" },
    { property: "og:title", content: "Eukleya - AI Resume Analyzer" },
    { property: "og:description", content: "Let your work speak well of you. Get instant AI-powered feedback on your resume. Start your free 3-day trial!" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="main-section flex-1">
        <div className="page-heading py-16">
          <h1 className="hero-heading">
            Let your work speak well of you.
          </h1>
          <h2 className="hero-subheading">AI-powered resume feedback — ATS score, tone, structure, and skills, in seconds.</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="feature-card">
              <h3>ATS Score</h3>
              <p>Check how well your resume passes Applicant Tracking Systems</p>
            </div>
            <div className="feature-card">
              <h3>Tone & Style</h3>
              <p>Ensure your resume has the right professional tone</p>
            </div>
            <div className="feature-card">
              <h3>Content Analysis</h3>
              <p>Get suggestions to improve your resume content</p>
            </div>
            <div className="feature-card">
              <h3>Skill Matching</h3>
              <p>See how your skills match the job requirements</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/signup" className="primary-button text-lg px-8 py-4">
              Get Started Free - No Payment Required
            </Link>
            <p className="text-ink-soft mt-4">3-day free trial, no credit card needed</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}