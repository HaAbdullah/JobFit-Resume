import React, { useState } from "react";
import Chat from "../components/Chat";
import How from "../pages/How";
import Navbar from "../components/Navbar";
import "../styles/Main.css";

function Main() {
  // State for conversation history
  const [conversation, setConversation] = useState([]);

  return (
    <div className="claude-chat-container">
      <Navbar />
      <div className="jobfit-container">
        <h1 className="jobfit-title">
          Tailor-Made Resumes & Cover Letters
          <br />
          in <span className="jobfit-highlight">Seconds</span>
        </h1>

        <p className="jobfit-description">
          Upload your best resumes and the job you want - JobFit blends them
          into a polished, personalized application that gets noticed.
        </p>
      </div>
      <Chat conversation={conversation} setConversation={setConversation} />
      <How />
    </div>
  );
}

export default Main;
