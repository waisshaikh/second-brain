export const generateEmbedding = async (text) => {
  console.log("🔥 FUNCTION CALLED");

  try {
    console.log("TEXT:", text);
    console.log("KEY:", process.env.JINAAI_API_KEY);

    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        input: [text],
        model: "jina-embeddings-v3",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINAAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ RESPONSE RECEIVED");

    return response.data.data[0].embedding;
  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);
    throw error;
  }
};