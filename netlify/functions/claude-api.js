const axios = require("axios");

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
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-7-sonnet-20250219",
        messages: messages,
        max_tokens: 4096, // Increased token limit for resume generation
      },
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

    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.response?.data || { message: error.message },
      }),
    };
  }
};
