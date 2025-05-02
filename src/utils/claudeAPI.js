/**
 * Sends a job description to Claude API and gets a 3-line summary
 * @param {string} prompt - The combined resume and job description to process
 * @returns {Promise} - Response from Claude API
 */
export const sendJobDescriptionToClaude = async (prompt) => {
  try {
    // For debugging
    console.log("Sending prompt to Claude API, length:", prompt.length);

    const response = await fetch("/api/claude-api", {
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
