import Memory from "../models/memory.model.js";
import { generateTags } from "../services/ai.service.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { cosineSimilarity } from "../utils/similarity.js";
import axios from "axios";
import {
  detectType,
  extractYouTube,
  extractArticle,
  extractTweet,
  extractPDF,
} from "../services/extract.service.js";



export const saveMemory = async (req, res) => {
  try {
    const { url, description } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    let type = detectType(url);

    let extractedData = {};

    
    if (type === "article") {
      try {
        const head = await axios.head(url);
        if (head.headers["content-type"]?.startsWith("image/")) {
          type = "image";
        }
      } catch (e) {
      
      }
    }

    //  DIRECT extraction
    if (type === "youtube") {
      extractedData = await extractYouTube(url);
    } else if (type === "tweet") {
      extractedData = await extractTweet(url);
    } else if (type === "pdf") {
      extractedData = await extractPDF(url);
    } else if (type === "image") {
      extractedData = {
        title: "Image",
        description: description || "Saved image",
        content: url,
        thumbnail: url,
      };
    } else {
      extractedData = await extractArticle(url);
    }

    // AI content
    const aiContent = `
${type}
${extractedData.title || ""}
${extractedData.content || url}
${description || ""}
    `.slice(0, 1000);

    //  AI parallel 
    const [embedding, tags] = await Promise.all([
      generateEmbedding(aiContent).catch(() => []),
      generateTags(aiContent).catch(() => []),
    ]);

    // SAVE
    const memory = await Memory.create({
      user: req.user.id,
      type,
      url,
      title: extractedData.title || "Untitled",
      description:
        extractedData.description ||
        extractedData.title ||
        "",
      thumbnail: extractedData.thumbnail || "",
      content: extractedData.content || "",
      tags,
      embedding,
      status: "ready",
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
    const query = req.query.query || req.body.query;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    const keywords = query.toLowerCase().split(" ");

    //  generate embedding
    let queryEmbedding = [];
    try {
      queryEmbedding = await generateEmbedding(query);
    } catch (e) {
      console.log("Embedding failed, fallback to keyword search");
    }

    const memories = await Memory.find({ user: req.user.id });

    const scored = memories.map((mem) => {
      let score = 0;

      //  semantic score (MAIN)
      if (queryEmbedding.length && mem.embedding?.length) {
        const sim = cosineSimilarity(queryEmbedding, mem.embedding);

        // normalize (-1 → 1) → (0 → 1)
        score += (sim + 1) / 2;
      }

      //keyword boost (LOW weight)
      keywords.forEach((word) => {
        if (mem.title?.toLowerCase().includes(word)) score += 0.15;
        if (mem.content?.toLowerCase().includes(word)) score += 0.1;
        if (mem.tags?.includes(word)) score += 0.2;
      });

      //  type boost
      if (mem.type && query.includes(mem.type)) {
        score += 0.1;
      }

      return {
        ...mem.toObject(),
        score,
      };
    });

    const sorted = scored
      .filter((m) => m.score > 0.25) //  important filter
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
    const query = req.query.query || req.body.query;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    console.log("QUERY:", query);

    // improved query embedding
    const queryEmbedding = await generateEmbedding(
      `Search query: ${query}`
    );

    if (!queryEmbedding.length) {
      return res.json([]);
    }

    const memories = await Memory.find({ user: req.user.id });

    const scored = memories.map((mem) => {
      let score = 0;

      if (mem.embedding?.length) {
        const sim = cosineSimilarity(queryEmbedding, mem.embedding);

        //  normalized + boosted
        score += ((sim + 1) / 2) * 2;
      }

      // slight penalty for mismatch
      if (!mem.title?.toLowerCase().includes(query.toLowerCase())) {
        score -= 0.05;
      }

      return { ...mem.toObject(), score };
    });

    const sorted = scored
      .filter((m) => m.score > 0.35) 
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log("TOP SCORE:", sorted[0]?.score);

    res.json(sorted);

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

    const scored = memories.map((mem) => {
      let score = 0;

      // Semantic similarity
      if (target.embedding?.length && mem.embedding?.length) {
        score += cosineSimilarity(target.embedding, mem.embedding);
      }

      // TAG MATCH BOOST
      const commonTags = mem.tags?.filter((tag) =>
        target.tags?.includes(tag)
      );

      if (commonTags?.length) {
        score += commonTags.length * 0.5;
      }

      //\TYPE MATCH BOOST
      if (mem.type === target.type) {
        score += 0.2;
      }

      return {
        ...mem.toObject(),
        score,
      };
    });

    const sorted = scored
      .filter((m) => m.score > 0.1) 
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(sorted);

  } catch (error) {
    console.error("Related Error:", error.message);
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

        // LOWER THRESHOLD
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

