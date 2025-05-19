import React, { useState } from "react";
import Keywords from "./Tabs/Keywords";
import CompanyInsights from "./Tabs/CompanyInsights";
import QuestionBank from "./Tabs/QuestionBank";
import CompensationBenchmarking from "./Tabs/CompensationBenchmarking";
import "../styles/TabsContainer.css";

const TabsContainer = ({
  resume,
  jobDescription,
  analysisResults,
  isResumeSubmitted,
  isJobDescriptionSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState("keywords");

  const tabs = [
    { id: "keywords", label: "Keywords" },
    { id: "companyInsights", label: "Company Insights" },
    { id: "questionBank", label: "Question Bank" },
    { id: "compensationBenchmarking", label: "Compensation Benchmarking" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "keywords":
        return (
          <Keywords
            resume={resume}
            jobDescription={jobDescription}
            analysisResults={analysisResults}
          />
        );
      case "companyInsights":
        return (
          <CompanyInsights
            resume={resume}
            jobDescription={jobDescription}
            analysisResults={analysisResults}
          />
        );
      case "questionBank":
        return (
          <QuestionBank
            resume={resume}
            jobDescription={jobDescription}
            analysisResults={analysisResults}
          />
        );
      case "compensationBenchmarking":
        return (
          <CompensationBenchmarking
            resume={resume}
            jobDescription={jobDescription}
            analysisResults={analysisResults}
          />
        );
      default:
        return (
          <Keywords
            resume={resume}
            jobDescription={jobDescription}
            analysisResults={analysisResults}
          />
        );
    }
  };

  // Add console logs for debugging
  console.log("TabsContainer Props:", {
    resumeLength: resume?.length,
    jobDescriptionLength: jobDescription?.length,
    isResumeSubmitted,
    isJobDescriptionSubmitted,
  });

  if (!isResumeSubmitted || !isJobDescriptionSubmitted) {
    return null;
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content-container">
        <h2 className="tab-title">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </h2>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default TabsContainer;
