import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Link } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind - AI Resume Analyzer | Free 3-Day Trial" },
    { name: "description", content: "Get instant AI-powered feedback on your resume. Check ATS scores, improve tone and style, and land your dream job. Start your free 3-day trial today!" },
    { name: "keywords", content: "resume analyzer, AI resume review, ATS score, job application, resume feedback" },
    { property: "og:title", content: "Resumind - AI Resume Analyzer" },
    { property: "og:description", content: "Get instant AI-powered feedback on your resume. Start your free 3-day trial!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />
      <section className="main-section flex-1">
        <div className="page-heading py-16">
          <h1>
            AI-Powered Resume Analysis
          </h1>
          <h2>Get instant feedback on your resume and land your dream job.</h2>
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
            <p className="text-gray-500 mt-4">3-day free trial, no credit card needed</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}