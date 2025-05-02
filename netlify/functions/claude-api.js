const axios = require("axios");

// Configure axios with a timeout
const api = axios.create({
  timeout: 25000, // 25 seconds timeout
});

exports.handler = async function (event, context) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const messages = body.messages;
    const system = body.system; // Get system message

    // Get API key from environment variable
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    // Call Claude API with increased max_tokens for resume generation
    // Use simplified prompt for initial testing if message contains just "hi"
    const isTestMessage =
      messages.length === 1 &&
      messages[0].role === "user" &&
      messages[0].content.trim().toLowerCase() === "hi";

    const requestBody = {
      model: "claude-3-7-sonnet-20250219",
      system: isTestMessage ? "Respond with a simple hello message." : system,
      messages: messages,
      max_tokens: isTestMessage ? 100 : 4096, // Reduced tokens for test message
      temperature: 0.7,
    };

    console.log(
      "Sending request to Claude API with body:",
      JSON.stringify(requestBody).slice(0, 500) + "..."
    );

    const response = await api.post(
      "https://api.anthropic.com/v1/messages",
      requestBody,
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      }
    );

    // Return the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.log(
      "Error calling Claude API:",
      error.response?.data || error.message
    );

    // Detailed error logging
    if (error.code === "ECONNABORTED") {
      console.log("Request timed out on the axios client side");
    }

    let errorMessage = "An error occurred while generating the resume.";
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Response error data:", error.response.data);
      console.log("Response error status:", error.response.status);
      errorMessage = `API responded with status ${
        error.response.status
      }: ${JSON.stringify(error.response.data)}`;
      statusCode = error.response.status;
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received:", error.request);
      errorMessage = "No response received from API. Request timed out.";
      statusCode = 504; // Gateway Timeout
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error setting up request:", error.message);
      errorMessage = `Error setting up request: ${error.message}`;
    }

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
      }),
    };
  }
};
