import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultUserIcon from "../assets/user.svg";

const Navbar = () => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle scroll for navbar appearance
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Handle resize for responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Set up event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Mobile navbar layout
  if (isMobile) {
    return (
      <>
        {/* Top navbar */}
        <div className="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-4 py-4 bg-white shadow-sm z-50">
          <div className="flex-1">
            <Link to="/" className="text-green-800 font-bold text-xl font-sans">
              JobFit
            </Link>
          </div>
          <div className="flex items-center">
            {/* Hamburger menu button */}
            <button
              className="mr-4 text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            {isAuthenticated ? (
              <Link to="/account">
                <img
                  src={currentUser?.photoURL || defaultUserIcon}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  title={currentUser.displayName || "Profile"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultUserIcon;
                  }}
                />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-green-800 text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors text-sm"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`fixed top-16 inset-x-0 z-40 bg-white shadow-md transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              Home
            </Link>
            <Link
              to="/why"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              Why JobFit?
            </Link>
            <Link
              to="/how"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              How It Works
            </Link>
            <Link
              to="/contact"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              Contact Us
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={handleNavClick}
                className="block py-2 text-gray-800 hover:text-green-800"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </>
    );
  }

  // Desktop navbar layout - single navbar with all elements aligned
  return (
    <div
      className={`${
        scrolled
          ? "fixed top-4 left-0 right-0 mx-auto max-w-6xl bg-white bg-opacity-90 backdrop-blur-sm shadow-md rounded-full"
          : "absolute top-0 left-0 right-0 w-full bg-white"
      } px-8 py-4 flex items-center justify-between z-40 transition-all duration-300`}
    >
      {/* Logo on the left */}
      <div>
        <Link to="/" className="text-green-800 font-bold text-2xl font-sans">
          JobFit
        </Link>
      </div>

      {/* Navigation in the center */}
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/why"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          Why JobFit?
        </Link>
        <Link
          to="/how"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          How It Works
        </Link>
        <Link
          to="/contact"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          Contact Us
        </Link>
      </div>

      {/* Sign Up/Login buttons on the right */}
      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <Link to="/account">
            <img
              src={currentUser?.photoURL || defaultUserIcon}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              title={currentUser.displayName || "Profile"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultUserIcon;
              }}
            />
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="text-green-800 font-semibold hover:text-green-700 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-green-800 text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
