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

  // Simplified instructions for testing if just saying "hi"
  const isTestMessage =
    messages.length === 1 &&
    messages[0].role === "user" &&
    messages[0].content.trim().toLowerCase() === "hi";

  // Resume building system instructions
  const resumeInstructions = isTestMessage
    ? "Respond with a simple hello message."
    : `# Comprehensive Resume Generation Instructions
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
${
  jobType === "US"
    ? `- FORMAT contact information as:
  Email: bilal.hasanjee1@gmail.com
  Cell: +1-647-687-7567
        +1-646-408-2127; New York
- KEEP "Authorized to work in the U.S." text
- INCLUDE both Toronto and New York in current position location`
    : jobType === "Canada"
    ? `- FORMAT contact information as:
  Email: bilal.hasanjee1@gmail.com
  Cell: +1-647-687-7567; Toronto
- REMOVE "Authorized to work in the U.S." text
- UPDATE current position to Toronto only`
    : `- FORMAT contact information as:
  Email: bilal.hasanjee1@gmail.com
  Cell: +1-647-687-7567; ${jobType}
- CHANGE "(Authorized to work in the U.S.)" to "(Canadian Citizen with GCC and US/UK Experience)"
- You can go beyond 2 pages and add CIBC experience and expand Middle East experiences`
}

### CONTENT OPTIMIZATION
- Analyze job descriptions thoroughly before customization
- Extract key requirements, terminology, and desired qualifications
- Tailor "Key Experience & Skills" section directly to job requirements
- Modify experience bullet points to highlight relevant achievements
- Use exact terminology from the job posting for ATS optimization
- Focus on leadership capabilities, technical expertise, and stakeholder management

### IMPLEMENTATION APPROACH
1. Return the resume as properly formatted HTML for display on the website
2. PRE-ANALYZE content length before generation
3. MONITOR space usage continuously during creation
4. Include print optimization for PDF download
5. Make the resume visually appealing with appropriate formatting

### RESPONSE FORMAT
- Return the resume as properly formatted HTML using only these tags: <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <br>, <hr>, <div>
- Use <h1> for the name, <h2> for main sections, <h3> for subsections
- Use <strong> for company names and job titles
- Use <ul> and <li> for bullet points
- Include appropriate CSS styles inline for printing
- Do not include any explanations before or after the HTML content`;

  try {
    // Filter out any invalid roles (like a system message from previous bugged states)
    const filteredMessages = messages.filter(
      (msg) => msg.role === "user" || msg.role === "assistant"
    );

    const body = {
      system: resumeInstructions, // ✅ Use top-level `system`
      messages: filteredMessages, // ✅ Only allowed roles
      jobType: jobType, // Pass job type to API
      isTestMessage: isTestMessage, // Flag for test message
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
