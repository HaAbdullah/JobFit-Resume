import React, { useState, useEffect } from "react";
import { sendJobDescriptionToClaude } from "../utils/claudeAPI";
import downloadIcon from "../assets/download.png";
import rotateIcon from "../assets/rotate.png";
import "../styles/JobAnalysis.css";

function JobAnalysis({ resume, isResumeSubmitted, onStartNewApplication }) {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [finalClaudePrompt, setFinalClaudePrompt] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);

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

  const handleSendJobDescription = async () => {
    if (!jobDescriptionInput.trim()) return;
    setIsLoading(true);
    setError("");
    setSummary("");
    setCoverLetter("");

    // Create the prompt
    let createdPrompt =
      "RESUME\n" + resume + "\nJOB DESCRIPTION\n" + jobDescriptionInput;
    setFinalClaudePrompt(createdPrompt);

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

  if (!isResumeSubmitted) {
    return null;
  }

  return (
    <div className="job-analysis-container">
      <div className="message-input">
        <h2 className="upload-title">
          Add the job posting. We'll analyze what the company is really looking
          for.
        </h2>
        <div className="text-input-box">
          <div className="textarea-wrapper">
            <textarea
              value={jobDescriptionInput}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
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
              !jobDescriptionInput.trim() || isLoading || generatingCoverLetter
            }
            className="generate-button"
          >
            {isLoading ? "Generating..." : "Generate Resume"}
          </button>
          <button
            onClick={handleGenerateCoverLetter}
            disabled={
              !jobDescriptionInput.trim() || generatingCoverLetter || isLoading
            }
            className="generate-button cover-letter-button"
          >
            {generatingCoverLetter ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>
      </div>

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
            <button onClick={onStartNewApplication} className="download-button">
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
            <button onClick={onStartNewApplication} className="download-button">
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

export default JobAnalysis;
