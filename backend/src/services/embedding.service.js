import axios from "axios";

const normalize = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / magnitude);
};

export const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      }
    );

    const embedding = response.data.flat();

    return normalize(embedding);
  } catch (error) {
    console.error("Embedding Error:", error.response?.data || error.message);
    return [];
  }
};