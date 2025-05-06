import { useState, useEffect } from "react";

const Navbar = () => {
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
            <a href="/" className="text-green-800 font-bold text-xl font-sans">
              JobFit
            </a>
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
            <a
              href="#signup"
              className="bg-green-800 text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors text-sm"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`fixed top-16 inset-x-0 z-40 bg-white shadow-md transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-3 space-y-2">
            <a
              href="#home"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              Home
            </a>
            <a
              href="#why"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              Why JobFit?
            </a>
            <a
              href="#how"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              How It Works
            </a>
            <a
              href="#contact"
              onClick={handleNavClick}
              className="block py-2 text-gray-800 hover:text-green-800"
            >
              Contact Us
            </a>
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
        <a href="/" className="text-green-800 font-bold text-2xl font-sans">
          JobFit
        </a>
      </div>

      {/* Navigation in the center */}
      <div className="flex items-center space-x-8">
        <a
          href="#home"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          Home
        </a>
        <a
          href="#why"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          Why JobFit?
        </a>
        <a
          href="#how"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          How It Works
        </a>
        <a
          href="#contact"
          className="text-gray-800 font-normal hover:text-green-800 transition-colors"
        >
          Contact Us
        </a>
      </div>

      {/* Sign Up button on the right */}
      <div>
        <a
          href="#signup"
          className="bg-green-800 text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Navbar;
