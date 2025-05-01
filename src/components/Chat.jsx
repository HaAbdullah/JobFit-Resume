import React, { useState } from "react";
import { sendMessageToClaude } from "../utils/claudeAPI.js";
import "../styles/Chat.css";

function Chat({ conversation, setConversation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      const response = await sendMessageToClaude(updatedConversation);

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
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          Send
        </button>
      </div>

      {isLoading && <div className="loading">Claude is thinking...</div>}
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default Chat;
