import axios from "axios";

export const generateTags = async (text) => {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: `
You must return ONLY a list of 5 tags.

Rules:
- Only comma separated values
- No sentences
- No explanations
- No extra text

Example:
react, javascript, frontend, hooks, ui

Content:
${text.slice(0, 500)}
`,
        stream: false,
      }
    );

    const raw = response.data.response;

    //  Clean tags
    const tags = raw
      .replace("\n", "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    return tags;
  } catch (error) {
    console.error("Ollama Error:", error.message);
    return ["general"];
  }
};