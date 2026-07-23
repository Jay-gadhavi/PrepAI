/**
 * Clean and normalize raw extracted PDF text to conserve LLM tokens and remove noise.
 */
function cleanResumeText(text, maxChars = 2500) {
  if (!text) return "";

  let cleaned = text
    // Replace control characters and non-printable characters
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    // Normalize unicode spaces & tabs to standard space
    .replace(/[\t\r]/g, " ")
    // Collapse multiple consecutive newlines into double newline
    .replace(/\n\s*\n+/g, "\n\n")
    // Collapse multiple spaces into single space
    .replace(/ {2,}/g, " ")
    .trim();

  // Truncate to maxChars (~400-500 tokens max) to prevent token exhaustion in Gemini AI
  if (cleaned.length > maxChars) {
    cleaned = cleaned.slice(0, maxChars) + "\n...[text truncated for efficiency]";
  }

  return cleaned;
}

module.exports = cleanResumeText;