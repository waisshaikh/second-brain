import axios from "axios";

export const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/embeddings",
      {
        model: "nomic-embed-text",
        prompt: text.slice(0, 150), 
      }
    );

    return response.data.embedding || [];
  } catch (error) {
    console.error("Ollama Error:", error.message);
    return [];
  }
};