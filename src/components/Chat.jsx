import React, { useState, useRef, useEffect } from "react";
import { sendJobDescriptionToClaude } from "../utils/claudeAPI.js";
import { processPDFResume } from "../utils/pdfExtractor";
import uploadIcon from "../assets/upload.svg";
import rotateIcon from "../assets/rotate.png";
import downloadIcon from "../assets/download.png";

import "../styles/Chat.css";

import { jsPDF } from "jspdf";

function Chat() {
  // Step 1: User has submitted a resume
  const [isResumeSubmitted, setIsResumeSubmitted] = useState(false);
  const [resume, setResume] = useState("");
  // Step 2: User has submitted a job description
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescriptionInput, setjobDescriptionInput] = useState("");
  const [finalClaudePrompt, setfinalClaudePrompt] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);

  // New state for saved resumes
  const [savedResumes, setSavedResumes] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [resumeName, setResumeName] = useState("");

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

  useEffect(() => {
    if (!summary) return;

    const iframe = document.getElementById("summary-preview");
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(summary);
    doc.close();
  }, [summary]);

  useEffect(() => {
    if (!coverLetter) return;

    const iframe = document.getElementById("cover-letter-preview");
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(coverLetter);
    doc.close();
  }, [coverLetter]);

  // RESUME UPLOAD HANDLERS
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFileUpload = async (event) => {
    const files = event.target.files || event.dataTransfer.files;

    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    const maxFiles = Math.min(files.length, 5);
    let combinedText = "";
    let processedCount = 0;
    let hasError = false;

    for (let i = 0; i < maxFiles; i++) {
      const file = files[i];

      if (
        file.type !== "application/pdf" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Skip invalid files but continue processing others
        console.warn(`Skipping file ${file.name}: Invalid file type`);
        continue;
      }

      try {
        const extractedText = await processPDFResume(file);

        // Add a separator between different resumes
        if (combinedText && extractedText) {
          combinedText += "\n\n--- NEXT RESUME ---\n\n";
        }

        combinedText += extractedText;
        processedCount++;
      } catch (error) {
        console.error(`Error processing resume ${file.name}:`, error);
        hasError = true;
      }
    }

    if (processedCount > 0) {
      setResume(combinedText);
    }

    if (hasError) {
      setError(
        processedCount > 0
          ? `Processed ${processedCount} file(s), but some files couldn't be processed.`
          : "Failed to extract text from the resume(s). Try different files or paste the text."
      );
    }

    setIsLoading(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Check if more than 5 files are dropped
    if (e.dataTransfer.files.length > 5) {
      setError("You can only upload up to 3 resume files at once");
      return;
    }

    handleFileUpload(e);
  };

  const handleSendResume = async () => {
    if (!resume.trim()) return;
    setIsResumeSubmitted(true);
    // No automatic save dialog
  };

  const clearResumeData = () => {
    setResume("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSendJobDescription = async () => {
    if (!jobDescriptionInput.trim()) return;
    setIsLoading(true);
    setError("");
    setSummary("");
    setCoverLetter("");

    // Create the prompt
    let createdPrompt =
      "RESUME\n" + resume + "\nJOB DESCRIPTION\n" + jobDescriptionInput;
    setfinalClaudePrompt(createdPrompt);

    try {
      // Use the createdPrompt directly instead of finalClaudePrompt state
      const response = await sendJobDescriptionToClaude(createdPrompt);
      setSummary(response.content[0].text);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescriptionInput.trim() || !resume.trim()) return;
    setGeneratingCoverLetter(true);
    setError("");

    try {
      // Create the prompt with instructions for cover letter
      let coverLetterPrompt =
        "TASK: Generate a professional cover letter\n\nRESUME\n" +
        resume +
        "\nJOB DESCRIPTION\n" +
        jobDescriptionInput;

      // Send to the new API endpoint
      const response = await sendCoverLetterToClaude(coverLetterPrompt);
      setCoverLetter(response.content[0].text);
    } catch (err) {
      setError("Cover letter generation error: " + err.message);
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  // New function to send the cover letter request
  const sendCoverLetterToClaude = async (prompt) => {
    try {
      // For debugging
      console.log(
        "Sending cover letter prompt to Claude API, length:",
        prompt.length
      );
      const isLocalhost = window.location.hostname === "localhost";

      const API_BASE_URL = isLocalhost
        ? "http://localhost:3000/api"
        : "https://jobfit-backend-29ai.onrender.com/api";

      const response = await fetch(`${API_BASE_URL}/create-cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: prompt, // Send the full prompt
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed (${response.status}): ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Claude API for cover letter:", error);
      throw error;
    }
  };

  const downloadPDF = (content, type) => {
    if (!content) return;

    try {
      // Open a new window
      const printWindow = window.open("", "_blank", "width=800,height=600");

      if (!printWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
        return;
      }

      // Write the HTML content to the new window
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();

      // Wait for the content to fully load before printing
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        // Optional: close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    } catch (err) {
      console.error(`Error during printing ${type}:`, err);
      alert(`An error occurred while printing the ${type}.`);
    }
  };

  const handleStartNewApplication = () => {
    // Reset resume data
    setResume("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    // Reset job description input
    setjobDescriptionInput("");

    // Reset generated content
    setSummary("");
    setCoverLetter("");

    // Reset states
    setIsResumeSubmitted(false);
    setIsLoading(false);
    setGeneratingCoverLetter(false);
    setError("");
    setfinalClaudePrompt("");
    setShowSaveDialog(false);

    // Scroll back to top (optional)
    window.scrollTo(0, 0);
  };

  // New functions for resume saving functionality
  const saveResume = () => {
    if (!resume.trim() || !resumeName.trim()) return;

    const newSavedResumes = [
      ...savedResumes,
      {
        id: Date.now().toString(),
        name: resumeName,
        content: resume,
      },
    ];

    setSavedResumes(newSavedResumes);
    localStorage.setItem("savedResumes", JSON.stringify(newSavedResumes));
    setShowSaveDialog(false);
    setResumeName("");
  };

  // Replace the current loadResume function with this updated version
  const loadResume = (resumeContent) => {
    // Check if there's already content in the resume textarea
    if (resume.trim()) {
      // If there's existing content, append a separator and the new content
      setResume(
        (prevResume) =>
          `${prevResume}\n\n--- NEXT RESUME ---\n\n${resumeContent}`
      );
    } else {
      // If there's no existing content, just set the resume content
      setResume(resumeContent);
    }
  };

  const deleteResume = (id) => {
    const updatedResumes = savedResumes.filter((resume) => resume.id !== id);
    setSavedResumes(updatedResumes);
    localStorage.setItem("savedResumes", JSON.stringify(updatedResumes));
  };

  return (
    <div className="chat-container">
      <div className="upload-options">
        <div className="upload-section">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="file-input"
            multiple
            style={{ display: "none" }}
          />
          <h2 className="upload-title">
            Upload 1–3 versions of your resume that best reflect your
            experience.
          </h2>

          <div className="upload-area-container">
            <div
              className={`upload-box ${isDragging ? "dragging" : ""}`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon-container">
                <img src={uploadIcon} alt="Upload" className="upload-icon" />
              </div>
              <p className="upload-instruction">
                Drag files here or click to upload (up to 5 files)
              </p>
              <p className="upload-formats">Accepted formats: PDF, DOCX</p>
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                style={{ display: "none" }}
              />
            </div>

            <div className="text-input-box">
              <div className="textarea-wrapper">
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Or if you prefer, paste your resume(s) content here..."
                  disabled={isLoading}
                />
                {resume && (
                  <button
                    onClick={clearResumeData}
                    className="clear-button"
                    disabled={isLoading}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Save Resume Button and Saved Resumes Display */}
          <div className="saved-resumes-container">
            {resume.trim() && !isLoading && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="save-resume-button"
              >
                Save Current Resume
              </button>
            )}

            {savedResumes.length > 0 && (
              <>
                <h3 className="saved-resumes-title">Your Saved Resumes</h3>
                <div className="saved-resumes-list">
                  {savedResumes.map((savedResume) => (
                    <div key={savedResume.id} className="saved-resume-item">
                      <span
                        className="saved-resume-name"
                        onClick={() => loadResume(savedResume.content)}
                      >
                        {savedResume.name}
                      </span>
                      <button
                        className="delete-resume-button"
                        onClick={() => deleteResume(savedResume.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleSendResume}
        disabled={!resume.trim() || isLoading}
        className="submit-resume-button"
      >
        Submit Resume
      </button>

      {/* Save Resume Dialog */}
      {showSaveDialog && (
        <div className="save-resume-dialog">
          <div className="save-resume-content">
            <h3>Save Your Resume</h3>
            <p>Enter a name to save this resume for future use</p>
            <input
              type="text"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="Resume name (e.g. Software Developer)"
              className="resume-name-input"
              autoFocus
            />
            <div className="save-resume-buttons">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setResumeName("");
                }}
                className="cancel-save-button"
              >
                Cancel
              </button>
              <button
                onClick={saveResume}
                className="confirm-save-button"
                disabled={!resumeName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isResumeSubmitted && (
        <div className="message-input">
          <h2 className="upload-title">
            Add the job posting. We'll analyze what the company is really
            looking for.
          </h2>
          <div className="text-input-box">
            <div className="textarea-wrapper">
              <textarea
                value={jobDescriptionInput}
                onChange={(e) => setjobDescriptionInput(e.target.value)}
                placeholder="Paste the job description here..."
                disabled={isLoading || generatingCoverLetter}
                rows={8}
              />
            </div>
          </div>
          <div className="action-buttons">
            <button
              onClick={handleSendJobDescription}
              disabled={
                !jobDescriptionInput.trim() ||
                isLoading ||
                generatingCoverLetter
              }
              className="generate-button"
            >
              {isLoading ? "Generating..." : "Generate Resume"}
            </button>
            <button
              onClick={handleGenerateCoverLetter}
              disabled={
                !jobDescriptionInput.trim() ||
                generatingCoverLetter ||
                isLoading
              }
              className="generate-button cover-letter-button"
            >
              {generatingCoverLetter
                ? "Generating..."
                : "Generate Cover Letter"}
            </button>
          </div>
        </div>
      )}

      {(isLoading || generatingCoverLetter) && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating {isLoading ? "resume" : "cover letter"}...</p>
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {summary && (
        <div>
          <div className="summary-section">
            {/* Preview Iframe */}

            <iframe
              id="summary-preview"
              style={{
                width: "100%",
                height: "600px",
                border: "1px solid #ccc",
              }}
              title="Resume Preview"
            />
          </div>
          <div className="action-buttons">
            <button
              onClick={handleStartNewApplication}
              className="download-button"
            >
              <img src={rotateIcon} alt="New Application" />
              Start a New Application
            </button>
            <button
              onClick={() => downloadPDF(summary, "resume")}
              className="download-button"
            >
              <img src={downloadIcon} alt="Download" />
              Download as PDF
            </button>
          </div>
        </div>
      )}

      {coverLetter && (
        <div>
          <div className="summary-section">
            {/* Cover Letter Preview Iframe */}
            <iframe
              id="cover-letter-preview"
              style={{
                width: "100%",
                height: "600px",
                border: "1px solid #ccc",
              }}
              title="Cover Letter Preview"
            />
          </div>
          <div className="action-buttons">
            <button
              onClick={handleStartNewApplication}
              className="download-button"
            >
              <img src={rotateIcon} alt="New Application" />
              Start a New Application
            </button>
            <button
              onClick={() => downloadPDF(coverLetter, "cover letter")}
              className="download-button"
            >
              <img src={downloadIcon} alt="Download" />
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
