import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://formspree.io/f/mzborobd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            email: "",
            message: "",
          });
        }, 3000);
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="pt-24 pb-16" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Questions? Feedback? Just Say Hi.
          </h1>
          <p className="text-xl">We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <span className="text-3xl">🛠</span>
                </div>
                <p className="text-lg">Need help using JobFit?</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <span className="text-3xl">💬</span>
                </div>
                <p className="text-lg">Have feedback or ideas?</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <p className="text-lg">Want to collaborate?</p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-lg mb-2">Reach us anytime at:</p>
              <a
                href="mailto:hello@jobfit.ai"
                className="text-xl font-semibold text-green-800 hover:underline"
              >
                📧 hello@jobfit.ai
              </a>
              <p className="mt-4 text-gray-600">
                We usually respond within 24 hours.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-800 text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors"
                >
                  SUBMIT
                </button>
              </div>
            </form>

            {submitted && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
                Message submitted! We'll get back to you soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
