import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Account = () => {
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      // Navigate happens automatically through Protected Route
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage({
        text: "Failed to log out. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-green-100"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold">
                {currentUser.displayName?.charAt(0) ||
                  currentUser.email?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentUser.displayName || "User Profile"}
            </h1>

            <div className="mt-4 space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Email</h2>
                <p className="mt-1 text-md text-gray-900">
                  {currentUser.email}
                </p>
              </div>

              {currentUser.displayName && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Name</h2>
                  <p className="mt-1 text-md text-gray-900">
                    {currentUser.displayName}
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Account Created
                </h2>
                <p className="mt-1 text-md text-gray-900">
                  {currentUser.metadata?.creationTime
                    ? new Date(
                        currentUser.metadata.creationTime
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Last Sign In
                </h2>
                <p className="mt-1 text-md text-gray-900">
                  {currentUser.metadata?.lastSignInTime
                    ? new Date(
                        currentUser.metadata.lastSignInTime
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mt-6 p-3 rounded-md ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Account Actions</h2>

          <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
