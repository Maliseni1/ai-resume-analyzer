import { Link, useParams } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import ScoreCircle from "~/components/ScoreCircle";
import { resumes } from "../../constants";

const Resume = () => {
  const params = useParams();
  const resume = resumes.find((item) => item.id === params.id);

  if (!resume) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
        <Navbar />
        <section className="main-section py-24 text-center flex-1">
          <div className="gradient-border shadow-lg bg-white rounded-3xl p-10 max-w-xl mx-auto">
            <h1>Resume not found</h1>
            <p className="text-gray-500 mt-4">We couldn't find the resume you're looking for.</p>
            <Link to="/" className="primary-button mt-6 inline-block">
              Back to home
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const { companyName, jobTitle, imagePath, feedback } = resume;
  const sections = [
    { title: "ATS", data: feedback.ATS },
    { title: "Tone & Style", data: feedback.toneAndStyle },
    { title: "Content", data: feedback.content },
    { title: "Structure", data: feedback.structure },
    { title: "Skills", data: feedback.skills },
  ];

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />
      <section className="main-section py-16 flex-1">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Resume Review</p>
                  <h1 className="text-4xl font-bold">{companyName}</h1>
                  <p className="text-lg text-gray-600">{jobTitle}</p>
                </div>
                <ScoreCircle score={feedback.overallScore} />
              </div>
            </div>

            <div className="gradient-border rounded-3xl overflow-hidden shadow-lg">
              <img src={imagePath} alt="Resume preview" className="w-full h-[370px] object-cover" />
            </div>

            <div className="grid gap-6">
              {sections.map((section) => (
                <div key={section.title} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                    <span className="text-sm text-gray-500">Score {section.data.score}</span>
                  </div>
                  <div className="space-y-4">
                    {section.data.tips.map((tip, index) => (
                      <div key={index} className="rounded-2xl border border-slate-200 p-4">
                        <p className="font-semibold">{tip.tip}</p>
                        {"explanation" in tip && <p className="text-sm text-gray-600 mt-2">{(tip as { explanation: string }).explanation}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Resume Actions</h2>
              <Link to="/upload" className="primary-button w-full text-center">
                Upload a new resume
              </Link>
              <Link to="/" className="mt-4 block text-center text-blue-600 underline">
                Back to home
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold">Tips</h3>
              <p className="text-sm text-gray-500 mt-3">
                Use this page to compare scores across categories and see where your resume can improve.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Resume;