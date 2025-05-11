import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatInterface.css";
import sendIcon from "../assets/send.svg"; // You'll need to add this to your assets

function ChatInterface({
  resume,
  jobDescriptionInput,
  isGenerating,
  onUpdateResume,
  onUpdateCoverLetter,
  activeDocument,
}) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add initial system message when component mounts
  useEffect(() => {
    if (messages.length === 0 && activeDocument) {
      setMessages([
        {
          id: Date.now(),
          sender: "system",
          text:
            activeDocument === "resume"
              ? "How would you like to improve your resume? Ask me anything about tailoring your resume to this job."
              : "How would you like to improve your cover letter? Ask me anything about enhancing your cover letter.",
        },
      ]);
    }
  }, [messages.length, activeDocument]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsSending(true);

    try {
      // Create prompt based on which document we're modifying
      const documentType =
        activeDocument === "resume" ? "resume" : "cover letter";

      // Prepare the prompt that will be sent to Claude
      const prompt = `
TASK: Modify the ${documentType} based on the user's request

RESUME
${resume}

JOB DESCRIPTION
${jobDescriptionInput}

CURRENT ${documentType.toUpperCase()}
${
  activeDocument === "resume"
    ? document.getElementById("summary-preview").contentDocument.documentElement
        .outerHTML
    : document.getElementById("cover-letter-preview").contentDocument
        .documentElement.outerHTML
}

USER REQUEST
${userInput}

Please provide a complete updated HTML version of the ${documentType} with all the requested changes implemented.
`;

      // Determine which API endpoint to use
      const endpoint =
        activeDocument === "resume" ? "create-resume" : "create-cover-letter";

      // For debugging
      console.log(
        `Sending ${documentType} modification request, length:`,
        prompt.length
      );

      // Call the API
      const isLocalhost = window.location.hostname === "localhost";
      const API_BASE_URL = isLocalhost
        ? "http://localhost:3000/api"
        : "https://jobfit-backend-29ai.onrender.com/api";

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: prompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed (${response.status}): ${errorText}`
        );
      }

      const data = await response.json();

      // Add assistant response to chat
      const assistantMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: `I've updated your ${documentType} as requested. The changes have been applied to the preview above.`,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update the appropriate document with the new content
      if (activeDocument === "resume") {
        onUpdateResume(data.content[0].text);
      } else {
        onUpdateCoverLetter(data.content[0].text);
      }
    } catch (error) {
      console.error("Error updating document:", error);

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: `I'm sorry, there was an error processing your request: ${error.message}`,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeDocument) return null;

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Chat With AI Assistant</h3>
        <p className="chat-subtitle">
          Ask questions or request changes to your {activeDocument}
        </p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === "user" ? "user-message" : "assistant-message"
            }`}
          >
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={isSending || isGenerating}
          rows={1}
          className="chat-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={!userInput.trim() || isSending || isGenerating}
          className="send-button"
        >
          <img src={sendIcon} alt="Send" />
        </button>
      </div>

      {isSending && (
        <div className="chat-loading">
          <div className="chat-spinner"></div>
          <p>Updating...</p>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
