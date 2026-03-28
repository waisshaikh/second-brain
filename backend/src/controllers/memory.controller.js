import Memory from "../models/memory.model.js";
import { generateTags } from "../services/ai.service.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { cosineSimilarity } from "../utils/similarity.js";
import {
  detectType,
  extractYouTube,
  extractArticle,
  extractTweet,
  extractPDF,
} from "../services/extract.service.js";




export const saveMemory = async (req, res) => {
  try {
    const { url, title, description } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // 1. Detect type
    const type = detectType(url);

    let extractedData = {};

    // 2. Extract data FIRST
  if (type === "youtube") {
  extractedData = await extractYouTube(url);
} else if (type === "tweet") {
  extractedData = await extractTweet(url);
} else if (type === "pdf") {
  extractedData = await extractPDF(url);
} else {
  extractedData = await extractArticle(url);
}

// 3. Prepare content for AI
    const aiContent = `
${type}
${extractedData.title || ""}
${extractedData.content || ""}
${description || ""}
`;

    // SAFETY: avoid empty AI calls
    const safeContent = aiContent.slice(0, 1000);

    // 4. Generate embedding (MANDATORY)
    let embedding = [];
    try {
      embedding = await generateEmbedding(safeContent);
    } catch (err) {
      console.error("Embedding failed:", err.message);
    }

    // 5. Generate tags
    let tags = [];
    try {
      tags = await generateTags(safeContent + " " + type);
    } catch (err) {
      console.error("Tagging failed:", err.message);
    }

    // 6. Save to DB
    const memory = await Memory.create({
      user: req.user.id,
      type,
      url,

      title: extractedData.title || title || "",
      description: description || "",
      thumbnail: extractedData.thumbnail || "",
      content: extractedData.content || "",

      tags,
      embedding, // CRITICAL FOR SEMANTIC SEARCH
    });

    res.json(memory);
  } catch (error) {
    console.error("Save Memory Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



// GET ALL MEMORIES
export const getMemories = async (req, res) => {
  const memories = await Memory.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(memories);
};

// DELETE MEMORY
export const deleteMemory = async (req, res) => {
  const { id } = req.params;

  await Memory.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });

  res.json({ message: "Deleted successfully" });
};



// ARCHIVE MEMORY
export const archiveMemory = async (req, res) => {
  const { id } = req.params;

  const memory = await Memory.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { isArchived: true },
    { new: true }
  );

  res.json(memory);
};


// sementic Search
export const searchMemories = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    const keywords = query.toLowerCase().split(" ");

    const memories = await Memory.find({ user: req.user.id });

    const scored = memories.map((mem) => {
  // 1 Semantic score 
  let score = cosineSimilarity(queryEmbedding, mem.embedding || []);

  // 2. Keyword boost
  keywords.forEach((word) => {
    if (mem.title?.toLowerCase().includes(word)) score += 0.3;
    if (mem.content?.toLowerCase().includes(word)) score += 0.2;
    if (mem.tags?.includes(word)) score += 0.5;
  });

  return {
    ...mem.toObject(),
    score,
  };
});
    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(sorted);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ message: "Search failed" });
  }
};


export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("QUERY:", query);

    const queryEmbedding = await generateEmbedding(query);

    const memories = await Memory.find({ user: req.user.id });

    const cosineSimilarity = (a, b) => {
      if (!a.length || !b.length) return 0;

      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

      return dot / (magA * magB);
    };

    const scored = memories.map((mem) => {
      const score = cosineSimilarity(queryEmbedding, mem.embedding || []);
      return { ...mem.toObject(), score };
    });

    // DEBUG
    console.log(
      scored.map((m) => ({
        title: m.title,
        score: m.score,
      }))
    );

    scored.sort((a, b) => b.score - a.score);

    console.log("TOP SCORE:", scored[0]?.score);
    const filtered = scored.filter((m) => m.score > 0.45);

    res.json(filtered.slice(0, 10));

  } catch (error) {
    console.error("Semantic Search Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRelatedMemories = async (req, res) => {
  try {
    const { id } = req.params;

    const target = await Memory.findById(id);

    if (!target) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const memories = await Memory.find({
      user: req.user.id,
      _id: { $ne: id },
    });

    const scored = memories.map((mem) => ({
      ...mem.toObject(),
      score: cosineSimilarity(target.embedding, mem.embedding || []),
    }));

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getClusters = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id });

    const clusters = {};

    memories.forEach((mem) => {
      const mainTag = mem.tags?.[0] || "general";

      if (!clusters[mainTag]) {
        clusters[mainTag] = [];
      }

      clusters[mainTag].push(mem);
    });

    res.json(clusters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getResurfacedMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id });

    const now = new Date();

    const resurfaced = memories.filter((mem) => {
      const diffDays =
        (now - new Date(mem.createdAt)) / (1000 * 60 * 60 * 24);

      return diffDays > 7; // older than 7 days
    });

    const random = resurfaced
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    res.json(random);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getGraphData = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id });

    const nodes = memories.map((mem) => ({
      id: mem._id.toString(),
      title: mem.title,
      group: mem.tags?.[0] || "general",
    }));

    const links = [];

    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const score = cosineSimilarity(
          memories[i].embedding || [],
          memories[j].embedding || []
        );

        // ✅ LOWER THRESHOLD
        if (score > 0.3) {
          links.push({
            source: memories[i]._id.toString(),
            target: memories[j]._id.toString(),
            value: score,
          });
        }
      }
    }

    
    if (links.length === 0 && memories.length > 1) {
      links.push({
        source: memories[0]._id.toString(),
        target: memories[1]._id.toString(),
        value: 1,
      });
    }

    res.json({
      nodes,
      links,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

