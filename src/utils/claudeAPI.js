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

/**
 * Sends user feedback to Claude API for regenerating a document
 * @param {string} documentType - Either "resume" or "cover letter"
 * @param {string} originalPrompt - The original resume and job description
 * @param {string} currentDocument - The current document content
 * @param {string} userFeedback - The user's feedback/instructions
 * @returns {Promise} - Response from Claude API with updated document
 */
export const sendChatFeedbackToClaude = async (
  documentType,
  originalPrompt,
  currentDocument,
  userFeedback
) => {
  try {
    // Create a comprehensive prompt with all context
    const feedbackPrompt =
      originalPrompt +
      `\n\nCURRENT ${documentType.toUpperCase()}\n` +
      currentDocument +
      `\n\nUSER FEEDBACK\n${userFeedback}\n\nPlease regenerate the ${documentType} based on this feedback.`;

    console.log(
      `Sending ${documentType} feedback to Claude API, length:`,
      feedbackPrompt.length
    );

    const isLocalhost = window.location.hostname === "localhost";
    const API_BASE_URL = isLocalhost
      ? "http://localhost:3000/api"
      : "https://jobfit-backend-29ai.onrender.com/api";

    // Use the appropriate endpoint based on document type
    const endpoint =
      documentType === "resume" ? "create-resume" : "create-cover-letter";

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription: feedbackPrompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error calling Claude API for ${documentType} feedback:`,
      error
    );
    throw error;
  }
};
