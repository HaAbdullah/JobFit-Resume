import React from "react";

const How = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Built with AI. Designed for Results.
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            JobFit intelligently tailors your resume and cover letter to the job
            you want — using multiple AI models and ATS optimization strategies
            to help you get noticed faster.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-green-800 text-white rounded-full mb-4">
              Step 1
            </div>
            <h2 className="text-2xl font-bold mb-4">Upload Your Resume(s)</h2>
            <p className="text-lg mb-4">
              You can upload up to 3 versions of your resume — versions you've
              created for different roles or highlight different experiences.
            </p>
            <div className="bg-green-50 border-l-4 border-green-800 p-4 rounded">
              <p className="font-semibold">Why?</p>
              <p>
                We use multiple natural language models to analyze your career
                from different angles. This gives JobFit more flexibility in
                choosing the strongest points for each unique application.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-green-800 text-white rounded-full mb-4">
              Step 2
            </div>
            <h2 className="text-2xl font-bold mb-4">Add the Job Description</h2>
            <p className="text-lg mb-4">
              Upload the job posting or paste it in directly. We break it down
              using a combination of custom-trained models and parsing
              algorithms.
            </p>
            <div className="bg-green-50 border-l-4 border-green-800 p-4 rounded">
              <p className="font-semibold">What we extract:</p>
              <ul className="list-disc ml-5 mt-2">
                <li>Key responsibilities and must-have skills</li>
                <li>Keywords used by recruiters and ATS bots</li>
                <li>Role-specific tone, industry jargon, and priorities</li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-green-800 text-white rounded-full mb-4">
              Step 3
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Intelligent Matching & Rewrite
            </h2>
            <p className="text-lg mb-4">
              Once we've analyzed your resumes and the job, our system goes to
              work:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-green-50 p-5 rounded-lg">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold mb-2">AI-Powered Tailoring</h3>
                <p>
                  We use a mix of language models, including GPT-based and
                  transformer-based custom models, to generate a resume and
                  cover letter that speak directly to the role.
                </p>
              </div>
              <div className="bg-green-50 p-5 rounded-lg">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-2">Strength Prioritization</h3>
                <p>
                  We emphasize your most relevant experiences, keywords, and
                  quantifiable achievements for that specific job.
                </p>
              </div>
              <div className="bg-green-50 p-5 rounded-lg">
                <div className="text-2xl mb-2">🧾</div>
                <h3 className="font-semibold mb-2">ATS Optimization</h3>
                <p>
                  We scan and format your documents to pass through applicant
                  tracking systems, so you don't get filtered out before a human
                  sees your name.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-block px-4 py-2 bg-green-800 text-white rounded-full mb-4">
              Step 4
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Download and Apply Confidently
            </h2>
            <p className="text-lg mb-4">In under 60 seconds, you'll receive:</p>
            <ul className="list-disc ml-5 mb-4">
              <li>A tailored resume aligned with the job's expectations</li>
              <li>A custom-written, well-formatted cover letter</li>
              <li>Files ready to upload to job portals or send directly</li>
            </ul>
            <div className="bg-green-50 border-l-4 border-green-800 p-4 rounded">
              <p className="font-semibold">Want to edit or fine-tune?</p>
              <p>
                You'll get clean, editable files so you can tweak anything
                before sending.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl font-semibold text-green-800">
            Bottom line: 📈 JobFit helps you apply smarter — not harder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default How;
