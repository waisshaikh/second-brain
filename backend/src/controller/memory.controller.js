import Memory from "../models/memory.model.js";

export const saveMemory = async (req, res) => {
  const { type, url, title, description } = req.body;

  const memory = await Memory.create({
    user: req.user.id,
    type,
    url,
    title,
    description,
  });

  res.json(memory);
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