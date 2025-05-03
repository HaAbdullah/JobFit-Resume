import React, { useState, useRef, useEffect } from "react";
import { sendJobDescriptionToClaude } from "../utils/claudeAPI.js";
import { processPDFResume } from "../utils/pdfExtractor";
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
  }, []);

  // RESUME UPLOAD HANDLERS
  const fileInputRef = useRef(null);

  const handleSendResume = async () => {
    if (!resume.trim()) return;
    setIsResumeSubmitted(true);
    // Additional logic after submitting resume
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const extractedText = await processPDFResume(file);
      setResume(extractedText);

      // Optional: Auto-submit if needed
      // setIsResumeSubmitted(true);
    } catch (error) {
      console.error("Error processing resume:", error);
      setError(
        "Failed to extract text from the PDF. Please try again or paste your resume directly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
  // Function to download as HTML or PDF
  const downloadPDF = () => {
    if (!summary) return;
    try {
      // mm I love a4
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Parse
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = summary;
      const cleanText = tempDiv.textContent || tempDiv.innerText || summary;

      // Set font size and add title
      doc.setFontSize(18);
      doc.text("Job Description Summary", 105, 20, { align: "center" });

      // Set font size for content
      doc.setFontSize(12);

      // Split text into lines that fit the page width
      const splitText = doc.splitTextToSize(cleanText, 170);
      doc.text(splitText, 20, 40);

      // Save the PDF
      doc.save("job_summary.pdf");
    } catch (err) {
      console.error("Error in PDF generation:", err);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  return (
    <div className="chat-container">
      <h2>Upload or Paste Your Resume</h2>

      <div className="upload-options">
        <div className="upload-section">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="file-input"
            style={{ display: "none" }}
          />
          <button
            onClick={triggerFileInput}
            className="upload-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Upload PDF Resume"}
          </button>
          <p className="or-divider">- OR -</p>
        </div>

        <div className="message-input">
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste resume here..."
            rows={8}
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

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleSendResume}
        disabled={!resume.trim() || isLoading}
        className="generate-button"
      >
        Submit Resume
      </button>
      {isResumeSubmitted && (
        <div className="message-input">
          <textarea
            value={jobDescriptionInput}
            onChange={(e) => setjobDescriptionInput(e.target.value)}
            placeholder="Paste job description here..."
            disabled={isLoading}
            rows={8}
          />
          <button
            onClick={handleSendJobDescription}
            disabled={!jobDescriptionInput.trim() || isLoading}
            className="generate-button"
          >
            {isLoading ? "Generating..." : "Generate Summary"}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating summary...</p>
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {summary && (
        <div className="summary-section">
          <h3>Summary Preview</h3>
          <div className="summary-content">{summary}</div>
          <div className="download-buttons">
            <button onClick={() => downloadPDF()} className="download-button">
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
