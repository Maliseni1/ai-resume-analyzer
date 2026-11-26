import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import ResumeCard from "~/components/ResumeCard";
import { useAuthStore } from "~/lib/auth";
import { getSupabaseClient } from "~/lib/supabase";
import { listUserResumes } from "~/lib/resumes";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Resumind" },
    { name: "description", content: "View and manage your resume analysis results. Track your ATS scores and improvement tips." },
    { name: "robots", content: "noindex" },
  ];
}

export default function Dashboard() {
    const { user, isLoading, trialDaysLeft, checkAuthStatus } = useAuthStore();
    const navigate = useNavigate();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [resumesLoading, setResumesLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/signin?next=/dashboard');
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        if (!user) return;
        const supabase = getSupabaseClient();
        listUserResumes(supabase, user.id)
            .then(setResumes)
            .finally(() => setResumesLoading(false));
    }, [user]);

    const showTrialExpired = trialDaysLeft === 0;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />
      {showTrialExpired && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center">
          Your free trial has ended. <Link to="/subscribe" className="underline font-semibold">Subscribe now</Link> to continue.
        </div>
      )}
      {!showTrialExpired && trialDaysLeft !== null && trialDaysLeft <= 1 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 text-center">
          Your free trial ends tomorrow! <Link to="/subscribe" className="underline font-semibold">Subscribe now</Link> to continue.
        </div>
      )}
      <section className="main-section flex-1">
        <div className="page-heading py-16">
            <h1>
                Track Your Applications & Resume Ratings
            </h1>
            <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>

      {resumesLoading ? (
          <p className="text-gray-500">Loading your resumes...</p>
      ) : resumes.length > 0 ? (
          <div className="resumes-section">
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume}/>
              ))}
          </div>
      ) : (
          <div className="text-center">
              <p className="text-gray-500 mb-4">You haven't uploaded a resume yet.</p>
              <Link to="/upload" className="primary-button inline-block">Upload your first resume</Link>
          </div>
      )}
      </section>
      <Footer />
    </main>
  );
}
