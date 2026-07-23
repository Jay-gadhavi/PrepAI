/**
 * Utility to validate whether extracted PDF text represents a genuine candidate resume.
 */
function validateResume(text) {
  if (!text || typeof text !== "string") {
    return {
      isValid: false,
      reason: "File appears to be empty or unreadable."
    };
  }

  const trimmed = text.trim();
  if (trimmed.length < 80) {
    return {
      isValid: false,
      reason: "The uploaded PDF has insufficient text. Please upload a standard resume."
    };
  }

  const lower = trimmed.toLowerCase();

  // Resume section indicators
  const resumeKeywords = [
    "experience",
    "education",
    "skills",
    "projects",
    "work",
    "history",
    "summary",
    "objective",
    "contact",
    "email",
    "phone",
    "qualification",
    "certif",
    "curriculum",
    "vitae",
    "resume",
    "profile",
    "achievement",
    "technical",
    "employment",
    "developer",
    "engineer",
    "intern",
    "university",
    "bachelor",
    "master"
  ];

  let keywordMatches = 0;
  for (const kw of resumeKeywords) {
    if (lower.includes(kw)) {
      keywordMatches++;
    }
  }

  // A genuine resume usually contains at least 3 typical resume indicator terms
  if (keywordMatches < 3) {
    return {
      isValid: false,
      reason: "The uploaded document does not appear to be a resume. Please upload a document containing your work experience, education, or skills."
    };
  }

  return { isValid: true };
}

module.exports = validateResume;
