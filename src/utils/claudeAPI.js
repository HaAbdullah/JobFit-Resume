// claudeAPI.js - Updated to use Netlify Functions

/**
 * Sends a message to Claude API through Netlify Function
 * @param {string} apiKey - Your Claude API key
 * @param {array} messages - Array of message objects with role and content
 * @returns {Promise} - Response from Claude API
 */
export const sendMessageToClaude = async (apiKey, messages) => {
  const headers = {
    "Content-Type": "application/json",
    "x-claude-api-key": apiKey, // Pass the API key in header
  };

  try {
    // Use relative URL that will be rewritten to Netlify function
    const response = await fetch("/api/claude-api", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API request failed: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

/**
 * Simple function to test if a Claude API key is valid
 * @param {string} apiKey - API key to test
 * @returns {Promise} - Resolution with boolean indicating success and response message
 */
export const testClaudeApiKey = async (apiKey) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "x-claude-api-key": apiKey,
    };

    // Use relative URL that will be rewritten to Netlify function
    const response = await fetch("/api/test-claude", {
      method: "POST",
      headers: headers,
    });

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
