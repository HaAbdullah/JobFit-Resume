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
1. Use provided HTML template formatting exactly 
2. PRE-ANALYZE content length before generation
3. MONITOR space usage continuously during creation
4. Include print optimization CSS
5. VERIFY page breaks are properly controlled`;

  try {
    // Add system instructions to every API call
    const messagesWithInstructions = [
      { role: "system", content: resumeInstructions },
      ...messages,
    ];

    // Use relative URL that will be rewritten to Netlify function
    const response = await fetch("/api/claude-api", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ messages: messagesWithInstructions }),
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
