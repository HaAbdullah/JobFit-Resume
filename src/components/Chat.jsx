import React, { useState, useRef } from "react";
import { sendMessageToClaude } from "../utils/claudeAPI.js";
import "../styles/Chat.css";

function Chat({ conversation, setConversation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const summaryRef = useRef(null);

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
    setGeneratedSummary("");

    try {
      const response = await sendMessageToClaude(updatedConversation);
      const responseContent = response.content[0].text;

      // Add Claude's response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: responseContent },
      ]);

      // Extract HTML content if it exists
      const htmlMatch = responseContent.match(/```html\n([\s\S]*?)\n```/);
      if (htmlMatch && htmlMatch[1]) {
        setGeneratedSummary(htmlMatch[1]);
      } else {
        setGeneratedSummary(responseContent);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download summary as HTML
  const downloadHTML = () => {
    if (!generatedSummary) return;

    // Create full HTML document with proper styling
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Summary</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
          }
          .summary-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-top: 0;
          }
          p {
            margin: 15px 0;
          }
          .summary-content {
            font-size: 16px;
          }
          @media print {
            body {
              padding: 0;
            }
            .summary-container {
              border: none;
              box-shadow: none;
              padding: 10px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="summary-container">
          <h1>Job Description Summary</h1>
          <div class="summary-content">
            ${generatedSummary}
          </div>
        </div>
      </body>
      </html>
    `;

    // Create blob and download link
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Job_Summary.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to download summary as PDF
  const printToPDF = () => {
    if (!generatedSummary) return;
    window.print();
  };

  return (
    <div className="chat-container">
      <h1>Job Description Summarizer</h1>
      <p className="instructions">
        Paste a job description below to generate a concise 3-line summary of
        the position.
      </p>

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
          {isLoading ? "Summarizing..." : "Generate Summary"}
        </button>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating your job summary...</p>
          <p className="loading-subtext">
            This may take a few seconds. Please be patient.
          </p>
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {generatedSummary && (
        <div className="summary-section">
          <div className="summary-actions">
            <button onClick={downloadHTML} className="download-button">
              Download as HTML
            </button>
            <button onClick={printToPDF} className="download-button">
              Save as PDF
            </button>
          </div>

          <div className="summary-preview">
            <h3>Summary Preview</h3>
            <div
              ref={summaryRef}
              className="summary-content"
              dangerouslySetInnerHTML={{ __html: generatedSummary }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
