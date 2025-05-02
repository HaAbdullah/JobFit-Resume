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

    // Extract the session ID and check if this is an initial request
    const isInitialRequest = body.action === "start";
    const sessionId = body.sessionId || Date.now().toString();

    // For initial requests, start the API call but return immediately
    if (isInitialRequest) {
      // Start the API call process asynchronously (don't await it)
      const apiCallPromise = initiateApiCall(body, sessionId);

      // Fire and forget - we'll handle completion through polling
      apiCallPromise.catch((err) =>
        console.error("Background API error:", err)
      );

      // Return immediately with a session ID for polling
      return {
        statusCode: 202, // Accepted
        headers,
        body: JSON.stringify({
          status: "processing",
          message: "Summary generation started",
          sessionId: sessionId,
        }),
      };
    }
    // For polling requests, check status and return result if available
    else if (body.action === "poll") {
      const result = await checkResultStatus(sessionId);

      if (result.status === "completed") {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result.data),
        };
      } else if (result.status === "error") {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: result.error }),
        };
      } else {
        // Still processing
        return {
          statusCode: 202,
          headers,
          body: JSON.stringify({
            status: "processing",
            message: "Summary generation in progress",
            sessionId: sessionId,
          }),
        };
      }
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid action" }),
      };
    }
  } catch (error) {
    console.log("Error:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Function to initiate the Claude API call
async function initiateApiCall(requestBody, sessionId) {
  try {
    const messages = requestBody.messages || [];
    const system = requestBody.system || "";

    // Get API key from environment variable
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      await saveResult(sessionId, null, "API key not configured");
      return;
    }

    // Prepare request payload with system message
    const requestPayload = {
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024, // Reduced token limit for simple summaries
      messages: messages,
    };

    // Add system instruction if provided
    if (system) {
      requestPayload.system = system;
    }

    // Call Claude API
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      requestPayload,
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Save result to storage system
    await saveResult(sessionId, response.data);
  } catch (error) {
    console.error("Error in API call:", error.message);
    await saveResult(sessionId, null, error.message);
  }
}

// This is a simplified storage mechanism - in a real app, you'd use KV store or similar
const results = {};

// Save result to storage
async function saveResult(sessionId, data, error = null) {
  results[sessionId] = {
    status: error ? "error" : "completed",
    timestamp: Date.now(),
    data: data,
    error: error,
  };
}

// Check result status
async function checkResultStatus(sessionId) {
  const result = results[sessionId];

  if (!result) {
    return { status: "processing" };
  }

  return result;
}
