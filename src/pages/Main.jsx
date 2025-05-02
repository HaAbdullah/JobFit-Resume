import React, { useState } from "react";
import Chat from "../components/Chat";
import "../styles/Main.css";

function Main() {
  // State for conversation history
  const [conversation, setConversation] = useState([]);

  return (
    <div className="claude-chat-container">
      <h1>Claude API Chat!</h1>

      <div className="conversation-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Claude"}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <Chat conversation={conversation} setConversation={setConversation} />
    </div>
  );
}

export default Main;
