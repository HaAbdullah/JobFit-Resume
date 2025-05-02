import React, { useState, useRef } from "react";
import { sendMessageToClaude } from "../utils/claudeAPI.js";
import "../styles/Chat.css";

function Chat({ conversation, setConversation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [jobType, setJobType] = useState("US"); // Default to US
  const [generatedResume, setGeneratedResume] = useState("");
  const resumeRef = useRef(null);

  // Send message functionality
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const updatedConversation = [
      ...conversation,
      { role: "user", content: message },
    ];

    setConversation(updatedConversation);
    setMessage("");
    setIsLoading(true);
    setError("");
    setGeneratedResume("");

    try {
      // Pass job type to API call
      const response = await sendMessageToClaude(updatedConversation, jobType);
      const responseContent = response.content[0].text;

      // Add Claude's response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: responseContent },
      ]);

      // Extract HTML content if it exists
      const htmlMatch = responseContent.match(/```html\n([\s\S]*?)\n```/);
      if (htmlMatch && htmlMatch[1]) {
        setGeneratedResume(htmlMatch[1]);
      } else {
        setGeneratedResume(responseContent);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download resume as HTML
  const downloadResume = () => {
    if (!generatedResume) return;

    // Create full HTML document with proper styling
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bilal Hasanjee - Resume</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.2;
            margin: 0;
            padding: 20px;
          }
          .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
          }
          h1, h2, h3, h4 {
            margin-top: 10px;
            margin-bottom: 5px;
          }
          p {
            margin: 0 0 8px;
          }
          ul {
            margin: 5px 0;
            padding-left: 20px;
          }
          li {
            margin-bottom: 3px;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .section {
            margin-bottom: 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .page-break {
              page-break-after: always;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${generatedResume}
        </div>
      </body>
      </html>
    `;

    // Create blob and download link
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bilal_Hasanjee_Resume.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to download resume as PDF
  const printToPDF = () => {
    if (!generatedResume) return;
    window.print();
  };

  return (
    <div className="chat-container">
      <h1>Bilal Hasanjee Resume Generator</h1>
      <p className="instructions">
        Paste a job description below and select your target location to
        generate a customized resume tailored to the position.
      </p>

      <div className="job-type-selector">
        <label>Job Location: </label>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          disabled={isLoading}
        >
          <option value="US">United States</option>
          <option value="Canada">Canada</option>
          <option value="Middle East">Middle East</option>
        </select>
      </div>

      <div className="message-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste job description here..."
          disabled={isLoading}
          rows={8}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          className="generate-button"
        >
          {isLoading ? "Generating..." : "Generate Resume"}
        </button>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating your customized resume...</p>
          <p className="loading-subtext">This may take up to 30 seconds</p>
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {generatedResume && (
        <div className="resume-section">
          <div className="resume-actions">
            <button onClick={downloadResume} className="download-button">
              Download as HTML
            </button>
            <button onClick={printToPDF} className="download-button">
              Save as PDF
            </button>
          </div>

          <div className="resume-preview">
            <h3>Resume Preview</h3>
            <div
              ref={resumeRef}
              className="resume-content"
              dangerouslySetInnerHTML={{ __html: generatedResume }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
