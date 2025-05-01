import React, { useState } from "react";
import { testClaudeApiKey, sendMessageToClaude } from "../utils/claudeAPI.js";
//import "./ClaudeChatComponent.css";

function Main() {
  // State variables
  const [apiKey, setApiKey] = useState("");
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState("");

  // Test API key functionality
  const handleTestApiKey = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await testClaudeApiKey(apiKey);

      if (result.success) {
        setIsApiKeyValid(true);
        setError("");
        // Add Claude's test response to conversation
        setConversation([
          {
            role: "user",
            content: "Say hello and tell me that my API key is working!",
          },
          { role: "assistant", content: result.message },
        ]);
      } else {
        setIsApiKeyValid(false);
        setError(result.message);
      }
    } catch (err) {
      setIsApiKeyValid(false);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message functionality
  const handleSendMessage = async () => {
    if (!message.trim() || !isApiKeyValid) return;

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
      const response = await sendMessageToClaude(apiKey, updatedConversation);

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
    <div className="claude-chat-container">
      <h1>Claude API Chat</h1>

      {/* API Key Section */}
      <div className="api-key-section">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Claude API key"
          disabled={isApiKeyValid}
        />
        <button
          onClick={handleTestApiKey}
          disabled={!apiKey || isLoading || isApiKeyValid}
        >
          {isLoading ? "Testing..." : "Test API Key"}
        </button>

        {isApiKeyValid && (
          <span className="success-message">✅ API Key Valid</span>
        )}
        {error && <span className="error-message">❌ {error}</span>}
      </div>

      {/* Chat Section - Only visible after API key validation */}
      {isApiKeyValid && (
        <>
          <div className="conversation-container">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "Claude"}:</strong>
                <p>{msg.content}</p>
              </div>
            ))}
            {isLoading && <div className="loading">Claude is thinking...</div>}
          </div>

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
        </>
      )}
    </div>
  );
}

export default Main;
