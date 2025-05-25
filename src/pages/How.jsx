import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroImage from "../assets/hero2.jpg";

const How = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-16 mt-32 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-emerald-500/5 p-8 mb-8 transition-colors">
          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-green-700 dark:bg-gradient-to-r dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 text-white rounded-full mb-4 transition-colors shadow-sm">
              Step 1
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
              Upload Your Resume(s)
            </h2>
            <p className="text-lg mb-4 text-gray-800 dark:text-gray-300 transition-colors">
              You can upload up to 3 versions of your resume — versions you've
              created for different roles or highlight different experiences.
            </p>
            <div className="bg-green-50 dark:bg-emerald-900/20 border-l-4 border-green-700 dark:border-emerald-500 p-4 rounded transition-colors">
              <p className="font-semibold text-gray-900 dark:text-gray-50 transition-colors">
                Why?
              </p>
              <p className="text-gray-800 dark:text-gray-300 transition-colors">
                We use multiple natural language models to analyze your career
                from different angles. This gives JobFitt.ai more flexibility in
                choosing the strongest points for each unique application.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-green-700 dark:bg-gradient-to-r dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 text-white rounded-full mb-4 transition-colors shadow-sm">
              Step 2
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
              Add the Job Description
            </h2>
            <p className="text-lg mb-4 text-gray-800 dark:text-gray-300 transition-colors">
              Upload the job posting or paste it in directly. We break it down
              using a combination of custom-trained models and parsing
              algorithms.
            </p>
            <div className="bg-green-50 dark:bg-emerald-900/20 border-l-4 border-green-700 dark:border-emerald-500 p-4 rounded transition-colors">
              <p className="font-semibold text-gray-900 dark:text-gray-50 transition-colors">
                What we extract:
              </p>
              <ul className="list-disc ml-5 mt-2 text-gray-800 dark:text-gray-300 transition-colors">
                <li>Key responsibilities and must-have skills</li>
                <li>Keywords used by recruiters and ATS bots</li>
                <li>Role-specific tone, industry jargon, and priorities</li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-green-700 dark:bg-gradient-to-r dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 text-white rounded-full mb-4 transition-colors shadow-sm">
              Step 3
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
              Intelligent Matching & Rewrite
            </h2>
            <p className="text-lg mb-4 text-gray-800 dark:text-gray-300 transition-colors">
              Once we've analyzed your resumes and the job, our system goes to
              work:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-green-50 dark:bg-emerald-900/20 p-5 rounded-lg transition-colors">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
                  AI-Powered Tailoring
                </h3>
                <p className="text-gray-800 dark:text-gray-300 transition-colors">
                  We use a mix of language models, including GPT-based and
                  transformer-based custom models, to generate a resume and
                  cover letter that speak directly to the role.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-emerald-900/20 p-5 rounded-lg transition-colors">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
                  Strength Prioritization
                </h3>
                <p className="text-gray-800 dark:text-gray-300 transition-colors">
                  We emphasize your most relevant experiences, keywords, and
                  quantifiable achievements for that specific job.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-emerald-900/20 p-5 rounded-lg transition-colors">
                <div className="text-2xl mb-2">🧾</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
                  ATS Optimization
                </h3>
                <p className="text-gray-800 dark:text-gray-300 transition-colors">
                  We scan and format your documents to pass through applicant
                  tracking systems, so you don't get filtered out before a human
                  sees your name.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-block px-4 py-2 bg-green-700 dark:bg-gradient-to-r dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 text-white rounded-full mb-4 transition-colors shadow-sm">
              Step 4
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
              Download and Apply Confidently
            </h2>
            <p className="text-lg mb-4 text-gray-800 dark:text-gray-300 transition-colors">
              In under 60 seconds, you'll receive:
            </p>
            <ul className="list-disc ml-5 mb-4 text-gray-800 dark:text-gray-300 transition-colors">
              <li>A tailored resume aligned with the job's expectations</li>
              <li>A custom-written, well-formatted cover letter</li>
              <li>Files ready to upload to job portals or send directly</li>
            </ul>
            <div className="bg-green-50 dark:bg-emerald-900/20 border-l-4 border-green-700 dark:border-emerald-500 p-4 rounded transition-colors">
              <p className="font-semibold text-gray-900 dark:text-gray-50 transition-colors">
                Want to edit or fine-tune?
              </p>
              <p className="text-gray-800 dark:text-gray-300 transition-colors">
                You'll get clean, editable files so you can tweak anything
                before sending.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl font-semibold text-green-800 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
            Bottom line: 📈 JobFitt.ai helps you apply smarter — not harder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default How;
