import React, { useState, useEffect } from "react";
import ResumeUpload from "./ResumeUpload";
import JobAnalysis from "./JobAnalysis";
import "../styles/Chat.css";

function Chat() {
  // Main state
  const [isResumeSubmitted, setIsResumeSubmitted] = useState(false);
  const [resume, setResume] = useState("");
  const [error, setError] = useState("");
  const [savedResumes, setSavedResumes] = useState([]);

  useEffect(() => {
    // Check if html2pdf is already loaded
    if (typeof window.html2pdf === "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true;
      script.onload = () => console.log("html2pdf loaded successfully");
      script.onerror = () => console.error("Failed to load html2pdf library");
      document.body.appendChild(script);
    }

    // Load saved resumes from localStorage
    const loadSavedResumes = () => {
      try {
        const savedResumesData = localStorage.getItem("savedResumes");
        if (savedResumesData) {
          setSavedResumes(JSON.parse(savedResumesData));
        }
      } catch (err) {
        console.error("Error loading saved resumes:", err);
      }
    };

    loadSavedResumes();
  }, []);

  const handleStartNewApplication = () => {
    // Reset all state
    setResume("");
    setIsResumeSubmitted(false);
    setError("");

    // Scroll back to top
    window.scrollTo(0, 0);
  };

  return (
    <div className="chat-container">
      <div className="upload-options">
        <ResumeUpload
          resume={resume}
          setResume={setResume}
          isLoading={false}
          setError={setError}
          savedResumes={savedResumes}
          setSavedResumes={setSavedResumes}
          setIsResumeSubmitted={setIsResumeSubmitted}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <JobAnalysis
        resume={resume}
        isResumeSubmitted={isResumeSubmitted}
        onStartNewApplication={handleStartNewApplication}
      />
    </div>
  );
}

export default Chat;
