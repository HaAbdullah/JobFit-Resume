import React from "react";

const Why = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Most People Use One Resume for Every Job. That's Why They Don't Get
            Interviews.
          </h1>
          <p className="text-xl font-medium mb-6">
            <strong>JobFit fixes that.</strong> We help you stand out by
            tailoring your application to <em>each</em> job you apply to—without
            the hours of rewriting.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Why it works:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <span className="text-3xl">🧠</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smarter Matching</h3>
                <p className="text-gray-700">
                  We analyze the job posting and your resume to surface what
                  matters most for that role.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <span className="text-3xl">✏️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Custom-Written, Every Time
                </h3>
                <p className="text-gray-700">
                  No templates, no fill-in-the-blanks. Your new resume and cover
                  letter are written from scratch for the job you choose.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <span className="text-3xl">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fast and Simple</h3>
                <p className="text-gray-700">
                  Upload → Match → Download. All in under a minute.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Built for Real Job Seekers
                </h3>
                <p className="text-gray-700">
                  Whether you're applying to 1 job or 100, JobFit helps you show
                  your best self—every time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl font-semibold text-green-800">
            Bottom line: More relevant applications = more callbacks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Why;
