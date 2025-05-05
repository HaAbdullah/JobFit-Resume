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

  useEffect(() => {
    if (!summary) return;

    const iframe = document.getElementById("summary-preview");
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(summary);
    doc.close();
  }, [summary]);

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
  const downloadPDF = () => {
    if (!summary) return;

    try {
      // Open a new window
      const printWindow = window.open("", "_blank", "width=800,height=600");

      if (!printWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
        return;
      }

      // Write the summary HTML to the new window
      printWindow.document.open();
      printWindow.document.write(summary);
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
      console.error("Error during printing:", err);
      alert("An error occurred while printing the document.");
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
            {isLoading ? "Generating..." : "Generate Resume"}
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

          {/* Preview Iframe */}
          <iframe
            id="summary-preview"
            style={{
              width: "100%",
              height: "600px",
              border: "1px solid #ccc",
              marginBottom: "1rem",
            }}
            title="Summary Preview"
          />

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
