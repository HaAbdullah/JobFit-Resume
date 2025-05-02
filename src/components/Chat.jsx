import React, { useState } from "react";
import { sendMessageToClaude } from "../utils/claudeAPI.js";
import "../styles/Chat.css";

function Chat({ conversation, setConversation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [jobType, setJobType] = useState("US"); // Default to US

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

    try {
      // Pass job type to API call
      const response = await sendMessageToClaude(updatedConversation, jobType);

      // Add Claude's response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: response.content[0].text },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
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
          rows={4}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          Generate Resume
        </button>
      </div>

      {isLoading && (
        <div className="loading">Generating your customized resume...</div>
      )}
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default Chat;
