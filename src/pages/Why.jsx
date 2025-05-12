import React from "react";

const Why = () => {
  return (
    <div className="pt-24 pb-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text mb-4 transition-colors">
            Most People Use One Resume for Every Job. That's Why They Don't Get
            Interviews.
          </h1>
          <p className="text-xl font-medium mb-6 text-gray-900 dark:text-gray-200 transition-colors">
            <strong>JobFit fixes that.</strong> We help you stand out by
            tailoring your application to <em>each</em> job you apply to—without
            the hours of rewriting.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12 transition-colors">
          <h2 className="text-2xl font-bold text-green-800 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text mb-6 transition-colors">
            Why it works:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <span className="text-3xl">🧠</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200 transition-colors">
                  Smarter Matching
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200 transition-colors">
                  Custom-Written, Every Time
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200 transition-colors">
                  Fast and Simple
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  Upload → Match → Download. All in under a minute.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200 transition-colors">
                  Built for Real Job Seekers
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">
                  Whether you're applying to 1 job or 100, JobFit helps you show
                  your best self—every time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl font-semibold text-green-800 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 dark:bg-clip-text transition-colors">
            Bottom line: More relevant applications = more callbacks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Why;
