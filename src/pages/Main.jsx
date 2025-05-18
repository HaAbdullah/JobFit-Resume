import React, { useState } from "react";
import Chat from "../components/Chat";
import How from "../pages/How";
import Navbar from "../components/Navbar";
import HeroImage from "../assets/Hero1.jpg";
import "../styles/Main.css";

function Main() {
  // State for conversation history
  const [conversation, setConversation] = useState([]);

  return (
    <div className="claude-chat-container">
      <Navbar />
      <div className="jobfit-hero-section">
        <div className="jobfit-content">
          <h1 className="jobfit-title">
            Tailor-Made Resumes & Cover Letters
            <br />
            in <span className="jobfit-highlight">Seconds</span>
          </h1>

          <p className="jobfit-description">
            Upload your latest / best resumes and the job you want - JobFit
            creates a customized resume, cover letter, company research and
            interview prep for you!
          </p>
        </div>
        <div className="jobfit-image">
          <img src={HeroImage} alt="JobFit Hero" />
        </div>
      </div>
      <Chat conversation={conversation} setConversation={setConversation} />
      <How />
    </div>
  );
}

export default Main;
