import React, { useState } from "react";
import Chat from "../components/Chat";
import "../styles/Main.css";

function Main() {
  // State for conversation history
  const [conversation, setConversation] = useState([]);

  return (
    <div className="claude-chat-container">
      <h1>Resume Bullet Point Generator</h1>
      <p className="instructions">
        Enter your Resume and Paste a job description below to generate a
        concise 3-line summary.
      </p>
      <Chat conversation={conversation} setConversation={setConversation} />
    </div>
  );
}

export default Main;
