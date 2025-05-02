/**
 * Sends a message to Claude API through Netlify Function
 * @param {array} messages - Array of message objects with role and content
 * @returns {Promise} - Response from Claude API
 */
export const sendMessageToClaude = async (messages) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Job summary system instructions
  const summaryInstructions = `# Job Description Summary Instructions
You are a specialized job description summarizer. Your task is to analyze a job description and provide a 3-line HTML summary that captures the essential information about the role.

### CRITICAL REQUIREMENTS
- Create EXACTLY 3 lines of summary text (three <p> tags)
- Line 1: Role title, company (if mentioned), and job type (remote/hybrid/onsite)
- Line 2: Primary responsibilities and required skills
- Line 3: Key qualifications (education, experience, certifications)
- Keep each line concise but informative
- Use professional language

### OUTPUT FORMAT
- Provide the summary in valid HTML format using <p> tags
- Wrap the HTML code in \`\`\`html code blocks
- Apply appropriate formatting for optimal readability
- Ensure the HTML is properly formatted for display in a web browser`;

  try {
    // Filter out any invalid roles
    const filteredMessages = messages.filter(
      (msg) => msg.role === "user" || msg.role === "assistant"
    );

    // Add special instruction to the last user message
    if (filteredMessages.length > 0) {
      const lastUserMsgIndex = filteredMessages.findLastIndex(
        (msg) => msg.role === "user"
      );
      if (lastUserMsgIndex !== -1) {
        const enhancedUserMessage =
          filteredMessages[lastUserMsgIndex].content +
          "\n\nPlease provide a 3-line summary of this job description in HTML format with each line in a separate <p> tag. " +
          "Wrap the HTML in ```html code blocks.";

        filteredMessages[lastUserMsgIndex] = {
          ...filteredMessages[lastUserMsgIndex],
          content: enhancedUserMessage,
        };
      }
    }

    // Create a session ID for this request
    const sessionId = Date.now().toString();

    // Initial API call to start the generation process
    const startResponse = await fetch("/api/claude-api", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        action: "start",
        sessionId: sessionId,
        system: summaryInstructions,
        messages: filteredMessages,
      }),
    });

    if (!startResponse.ok) {
      const errorData = await startResponse.json();
      throw new Error(
        `API request failed: ${startResponse.status} - ${JSON.stringify(
          errorData
        )}`
      );
    }

    // Start polling for results
    let resultData = null;
    let attempts = 0;
    const maxAttempts = 20; // Max 20 attempts (20 seconds with 1-second interval)

    while (attempts < maxAttempts) {
      attempts++;

      // Wait 1 second between polling attempts
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Poll for results
      const pollResponse = await fetch("/api/claude-api", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          action: "poll",
          sessionId: sessionId,
        }),
      });

      if (!pollResponse.ok) {
        // If there's an error, continue polling
        console.warn(
          `Polling attempt ${attempts} failed:`,
          await pollResponse.text()
        );
        continue;
      }

      const pollData = await pollResponse.json();

      // If processing is complete, we have our result
      if (pollData.status === "completed") {
        resultData = pollData;
        break;
      }

      // If there was an error, throw it
      if (pollData.status === "error") {
        throw new Error(`API processing error: ${pollData.error}`);
      }

      // Otherwise (status still "processing"), continue polling
    }

    // If we've exceeded max attempts, throw an error
    if (!resultData) {
      throw new Error("Summary generation timed out after 20 seconds");
    }

    return resultData;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};
