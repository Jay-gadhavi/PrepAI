function cleanResumeText(text) {
  if (!text) return "";

  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E\n]/g, "")
    .trim();
}

module.exports = cleanResumeText;