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
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme");
    // Make dark mode the default (only light mode if explicitly set)
    const prefersDark = savedTheme !== "light";
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleNavClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Enhanced base background styles for better dark mode appearance
  const baseBg = scrolled
    ? "bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-80 backdrop-blur-sm shadow-md rounded-full"
    : "bg-white dark:bg-gray-800";

  // Mobile version
  if (isMobile) {
    return (
      <>
        <div
          className={`fixed top-0 left-0 right-0 w-full flex justify-between items-center px-4 py-4 ${baseBg} z-50 transition-all duration-300`}
        >
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="JobFitt.Ai Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-green-800 dark:text-emerald-400 font-bold text-xl font-sans">
              JobFitt.Ai
            </span>
          </Link>
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle - enhanced styling */}
            <button
              onClick={toggleDarkMode}
              className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full p-1 relative focus:outline-none transition-colors"
              aria-label="Toggle theme"
            >
              <span
                className={`block w-4 h-4 bg-white dark:bg-emerald-400 rounded-full shadow-md transform transition-transform duration-300 ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </button>

            {/* Menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
              aria-label="Toggle menu"
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
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-transparent dark:border-emerald-500"
                />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-green-700 dark:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 text-sm transition-all duration-300 shadow-sm dark:shadow-emerald-500/20"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>

        <div
          className={`fixed top-16 inset-x-0 z-40 bg-white dark:bg-gray-900 shadow-md dark:shadow-emerald-500/5 transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-3 space-y-2">
            {["/", "/how", "/why", "/contact", "/dashboard"].map((path, i) => (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick}
                className="block py-2 text-gray-800 dark:text-gray-100 hover:text-green-800 dark:hover:text-emerald-400 transition-colors"
              >
                {
                  [
                    "Home",
                    "How It Works?",
                    "Why JobFitt.Ai?",
                    "Contact Us",
                    "Dashboard",
                  ][i]
                }
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={handleNavClick}
                className="block py-2 text-gray-800 dark:text-gray-100 hover:text-green-800 dark:hover:text-emerald-400 transition-colors"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div
      className={`px-8 py-4 flex items-center justify-between z-40 transition-all duration-300 ${
        scrolled
          ? "fixed top-4 left-0 right-0 mx-auto max-w-6xl"
          : "absolute top-0 left-0 right-0 w-full"
      } ${baseBg}`}
    >
      <Link to="/" className="flex items-center space-x-3">
        <img
          src="/logo.png"
          alt="JobFitt.Ai Logo"
          className="w-12 h-12 object-contain"
        />
        <span className="text-green-800 dark:text-emerald-400 font-bold text-2xl font-sans">
          JobFitt.Ai
        </span>
      </Link>

      <div className="flex items-center space-x-8">
        {["/", "/how", "/why", "/contact", "/dashboard"].map((path, i) => (
          <Link
            key={path}
            to={path}
            className="text-gray-800 dark:text-gray-100 hover:text-green-800 dark:hover:text-emerald-400 transition-colors"
          >
            {
              [
                "Home",
                "How It Works?",
                "Why JobFitt.Ai?",
                "Contact Us",
                "Dashboard",
              ][i]
            }
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        {/* Pricing button - always visible with same styling as Sign Up */}
        <Link
          to="/pricing"
          className="bg-green-700 dark:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors shadow-sm dark:shadow-emerald-500/20"
        >
          Pricing
        </Link>
        {/* Dark mode toggle - enhanced */}
        <button
          onClick={toggleDarkMode}
          className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full p-1 relative focus:outline-none transition-colors"
          aria-label="Toggle theme"
        >
          <span
            className={`block w-4 h-4 bg-white dark:bg-emerald-400 rounded-full shadow-md transform transition-transform duration-300 ${
              darkMode ? "translate-x-6" : "translate-x-0"
            }`}
          ></span>
        </button>

        {isAuthenticated ? (
          <Link to="/account">
            <img
              src={currentUser?.photoURL || defaultUserIcon}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-transparent dark:border-emerald-500"
            />
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="text-green-800 dark:text-emerald-400 font-semibold hover:text-green-700 dark:hover:text-emerald-300 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-green-700 dark:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors shadow-sm dark:shadow-emerald-500/20"
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
