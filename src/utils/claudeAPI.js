/**
 * Sends a message to Claude API through Netlify Function
 * @param {array} messages - Array of message objects with role and content
 * @param {string} jobType - The type of job (US, Canada, or Middle East)
 * @returns {Promise} - Response from Claude API
 */
export const sendMessageToClaude = async (messages, jobType = "US") => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Create location-specific formatting instructions based on job type
  let locationFormatting = "";

  if (jobType === "US") {
    locationFormatting =
      "- FORMAT contact information as:\n" +
      "  Email: bilal.hasanjee1@gmail.com\n" +
      "  Cell: +1-647-687-7567\n" +
      "        +1-646-408-2127; New York\n" +
      '- KEEP "Authorized to work in the U.S." text\n' +
      "- INCLUDE both Toronto and New York in current position location";
  } else if (jobType === "Canada") {
    locationFormatting =
      "- FORMAT contact information as:\n" +
      "  Email: bilal.hasanjee1@gmail.com\n" +
      "  Cell: +1-647-687-7567; Toronto\n" +
      '- REMOVE "Authorized to work in the U.S." text\n' +
      "- UPDATE current position to Toronto only";
  } else {
    locationFormatting =
      "- FORMAT contact information as:\n" +
      "  Email: bilal.hasanjee1@gmail.com\n" +
      "  Cell: +1-647-687-7567; " +
      jobType +
      "\n" +
      '- CHANGE "(Authorized to work in the U.S.)" to "(Canadian Citizen with GCC and US/UK Experience)"\n' +
      "- You can go beyond 2 pages and add CIBC experience and expand Middle East experiences";
  }

  // Resume building system instructions
  const resumeInstructions = `# Comprehensive Resume Generation Instructions
You are a specialized resume generator for Bilal Hasanjee. Follow these strict formatting requirements:

### CRITICAL FORMATTING REQUIREMENTS
- ENSURE the resume fits exactly on 2 pages when printed to PDF
- NO GAPS between job experiences (use 2-3px margins maximum)
- NO inconsistent spacing between sections
- COMPACT formatting throughout all sections
- SET line-height to 1.2 for all elements
- REDUCE paragraph and list margins by at least 20%

### HEADER FORMATTING
- FORMAT name section with "Bilal Hasanjee, CFA®, MBA, MSc Finance" all on one line
${locationFormatting}

### CONTENT OPTIMIZATION
- Analyze job descriptions thoroughly before customization
- Extract key requirements, terminology, and desired qualifications
- Tailor "Key Experience & Skills" section directly to job requirements
- Modify experience bullet points to highlight relevant achievements
- Use exact terminology from the job posting for ATS optimization
- Focus on leadership capabilities, technical expertise, and stakeholder management

### OUTPUT FORMAT
- Provide the complete resume in valid HTML format
- Wrap the HTML code in \`\`\`html code blocks
- Include inline CSS for proper formatting
- Ensure all styling follows the CRITICAL FORMATTING REQUIREMENTS
- Make sure the HTML is properly formatted for direct display in a web browser

### IMPLEMENTATION APPROACH
1. Use clean HTML with proper semantic tags
2. PRE-ANALYZE content length before generation
3. MONITOR space usage continuously during creation
4. Include print optimization CSS
5. VERIFY page breaks are properly controlled`;

  try {
    // Filter out any invalid roles (like a system message from previous bugged states)
    const filteredMessages = messages.filter(
      (msg) => msg.role === "user" || msg.role === "assistant"
    );

    // Add special instruction to the last user message to request HTML output
    if (filteredMessages.length > 0) {
      const lastUserMsgIndex = filteredMessages.findLastIndex(
        (msg) => msg.role === "user"
      );
      if (lastUserMsgIndex !== -1) {
        const enhancedUserMessage =
          filteredMessages[lastUserMsgIndex].content +
          "\n\nPlease format the resume in clean HTML that I can directly display on a webpage. " +
          "Wrap the HTML in ```html code blocks. Make sure all formatting is done through inline styles " +
          "to ensure consistent display and printing.";

        filteredMessages[lastUserMsgIndex] = {
          ...filteredMessages[lastUserMsgIndex],
          content: enhancedUserMessage,
        };
      }
    }

    const body = {
      system: resumeInstructions, // ✅ Use top-level system
      messages: filteredMessages, // ✅ Only allowed roles
    };

    const response = await fetch("/api/claude-api", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
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
