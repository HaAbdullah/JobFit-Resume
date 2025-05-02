import React, { useState, useRef } from "react";
import { sendMessageToClaude } from "../utils/claudeAPI.js";
import "../styles/Chat.css";

function Chat({ conversation, setConversation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [jobType, setJobType] = useState("US"); // Default to US
  const [resumeContent, setResumeContent] = useState("");
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
    setResumeContent(""); // Clear previous resume

    try {
      // Pass job type to API call
      const response = await sendMessageToClaude(updatedConversation, jobType);
      const responseContent = response.content[0].text;

      // Add Claude's response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: responseContent },
      ]);

      // Set resume content for download
      setResumeContent(responseContent);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download resume as text file
  const downloadResume = () => {
    if (!resumeContent) return;

    const element = document.createElement("a");
    const file = new Blob([resumeContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Bilal_Hasanjee_Resume_${jobType.replace(
      /\s+/g,
      "_"
    )}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Function to download as PDF (requires HTML content)
  const generatePDF = () => {
    if (!resumeContent || !resumeRef.current) return;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bilal Hasanjee Resume</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.2;
              margin: 0.5in;
              font-size: 10pt;
            }
            h1, h2, h3 {
              margin-top: 10px;
              margin-bottom: 5px;
            }
            p {
              margin: 2px 0;
            }
            ul {
              margin: 2px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 2px;
            }
            @media print {
              @page {
                size: letter;
                margin: 0.5in;
              }
              body {
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div id="resume-content">
            ${resumeRef.current.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() {
                window.close();
              }, 100);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="chat-container">
      <h1>Resume Generator for Bilal Hasanjee</h1>

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
          placeholder="Paste job description here or ask for resume customization..."
          disabled={isLoading}
          rows={6}
          className="description-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          className="generate-button"
        >
          Generate Resume
        </button>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Generating your customized resume...</div>
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {resumeContent && (
        <div className="resume-section">
          <h2>Generated Resume</h2>
          <div
            className="resume-preview"
            ref={resumeRef}
            dangerouslySetInnerHTML={{ __html: resumeContent }}
          ></div>
          <div className="download-options">
            <button onClick={downloadResume} className="download-button">
              Download as Text
            </button>
            <button
              onClick={generatePDF}
              className="download-button pdf-button"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
