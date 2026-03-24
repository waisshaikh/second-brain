import Memory from "../models/memory.model.js";

import {
  detectType,
  extractYouTube,
  extractArticle,
} from "../services/extract.service.js";

export const saveMemory = async (req, res) => {
  try {
    const { url, title, description } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    //  Detect type automatically
    const type = detectType(url);

    let extractedData = {};

    //  Extract based on type
    if (type === "youtube") {
      extractedData = await extractYouTube(url);
    } else {
      extractedData = await extractArticle(url);
    }

    //  Create memory with fallback support
    const memory = await Memory.create({
      user: req.user.id,
      type,
      url,

      title: extractedData.title || title || "",
      description: description || "",
      thumbnail: extractedData.thumbnail || "",
      content: extractedData.content || "",
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