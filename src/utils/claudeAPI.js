/**
 * Sends a message to Claude API through Netlify Function
 * @param {array} messages - Array of message objects with role and content
 * @returns {Promise} - Response from Claude API
 */
export const sendMessageToClaude = async (messages) => {
  const headers = {
    "Content-Type": "application/json",
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
