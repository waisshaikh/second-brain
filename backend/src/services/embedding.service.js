import axios from "axios";

export const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/embeddings",
      {
        model: "llama3",
        prompt: text.slice(0, 500),
      }
    );

    return response.data.embedding || [];
  } catch (error) {
    console.error("Embedding Error:", error.message);
    return [];
  }
};