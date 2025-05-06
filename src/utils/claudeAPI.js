/**
 * Sends a job description to Claude API and gets a resume
 * @param {string} prompt - The combined resume and job description to process
 * @returns {Promise} - Response from Claude API
 */
export const sendJobDescriptionToClaude = async (prompt) => {
  try {
    // For debugging
    console.log("Sending prompt to Claude API, length:", prompt.length);
    const isLocalhost = window.location.hostname === "localhost";

    const API_BASE_URL = isLocalhost
      ? "http://localhost:3000/api"
      : "https://jobfit-backend-29ai.onrender.com/api";

    const response = await fetch(`${API_BASE_URL}/create-resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription: prompt, // Send the full prompt as jobDescription
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

/**
 * Sends a job description and resume to Claude API to generate a cover letter
 * @param {string} prompt - The combined resume and job description with instructions for cover letter
 * @returns {Promise} - Response from Claude API
 */
export const sendCoverLetterToClaude = async (prompt) => {
  try {
    // For debugging
    console.log(
      "Sending cover letter prompt to Claude API, length:",
      prompt.length
    );
    const isLocalhost = window.location.hostname === "localhost";

    const API_BASE_URL = isLocalhost
      ? "http://localhost:3000/api"
      : "https://jobfit-backend-29ai.onrender.com/api";

    const response = await fetch(`${API_BASE_URL}/create-cover-letter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription: prompt, // Send the full prompt
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Claude API for cover letter:", error);
    throw error;
  }
};
