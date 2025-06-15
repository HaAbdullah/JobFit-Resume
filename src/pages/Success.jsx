import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Download, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Success = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Get session_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      // Optional: Verify the session with your backend
      verifySession(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const verifySession = async (sessionId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verify-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (error) {
      console.error("Error verifying session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    console.log("Download receipt");
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 dark:border-emerald-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 transition-all duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-green-100 dark:bg-emerald-900 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Welcome to{" "}
              <span className="text-green-700 dark:text-emerald-400 font-semibold">
                JobFitt.Ai
              </span>
              ! Your subscription is now active and you're ready to accelerate
              your job search.
            </p>

            {/* Plan Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionData?.planName || "Premium"} Plan Activated
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    What's Next?
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Access your dashboard
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Upload your first resume
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Start optimizing for ATS
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Explore company insights
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Your Benefits
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ATS-optimized resumes
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      AI interview coaching
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Company research tools
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Salary benchmarking
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleGoToDashboard}
                className="bg-green-700 dark:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 dark:hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-emerald-400 flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                onClick={handleDownloadReceipt}
                className="bg-gray-600 dark:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-green-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-emerald-800">
              <h3 className="text-lg font-semibold text-green-800 dark:text-emerald-300 mb-2">
                Need Help Getting Started?
              </h3>
              <p className="text-green-700 dark:text-emerald-400 mb-4">
                Check your email for a welcome guide, or contact our support
                team if you have any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:support@jobfitt.ai"
                  className="text-green-700 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 font-medium underline"
                >
                  Contact Support
                </a>
                <span className="hidden sm:inline text-green-600 dark:text-emerald-500">
                  •
                </span>
                <a
                  href="/help"
                  className="text-green-700 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 font-medium underline"
                >
                  View Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
