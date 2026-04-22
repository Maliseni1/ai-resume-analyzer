import { useState } from "react";
import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import { useAuthStore } from "~/lib/auth";

const Upload = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setStatus(null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setStatus("Please choose a file before uploading.");
      return;
    }

    if (!user) {
      setStatus("Please sign in before uploading a resume.");
      return;
    }

    setStatus("Uploading resume...");
    setStatus("Upload functionality coming soon!");
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Upload a Resume</h1>
          <h2>Drop your resume and let AI help you review it.</h2>
        </div>

        <div className="gradient-border shadow-lg p-8 bg-white rounded-3xl max-w-3xl mx-auto">
          {!user ? (
            <p className="text-center text-gray-500">Please sign in to upload a resume.</p>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleUpload}>
              <label className="flex flex-col gap-2">
                <span className="font-semibold">Select a resume PDF or DOCX</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </label>

              <button type="submit" className="primary-button w-fit" disabled={!!status}>
                {status ? "Uploading..." : "Upload Resume"}
              </button>

              {status && <p className="text-sm text-gray-600">{status}</p>}
            </form>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <p>Upload functionality coming soon! For now, review sample resumes.</p>
            <p>
              Want to review an existing sample resume? <Link to="/" className="text-blue-600 underline">Go back home</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Upload;
