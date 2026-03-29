import { GoogleGenAI } from "@google/genai";

export const generateTags = async (text) => {
  try {
    // ✅ INIT HERE (after env loaded)
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Return ONLY 5 tags (comma separated):
${text.slice(0, 500)}`,
    });

    const raw = response.text;

    return raw
      .replace(/\n/g, "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

  } catch (error) {
    console.error("Gemini Error:", error.message);
    return ["general"];
  }
};