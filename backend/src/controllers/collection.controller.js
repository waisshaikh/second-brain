import mongoose from "mongoose";
import Collection from "../models/collection.model.js";
import Memory from "../models/memory.model.js";


//  CREATE COLLECTION
export const createCollection = async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const collection = await Collection.create({
      user: req.user.id,
      name,
      color: color || "#00E19E",
      icon: icon || "📁",
    });

    res.json(collection);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//  GET USER COLLECTIONS
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(collections);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ADD MEMORY TO COLLECTION
export const addToCollection = async (req, res) => {
  try {
    const { memoryId, collectionId } = req.body;

    if (!memoryId || !collectionId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const memory = await Memory.findById(memoryId);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const objectId = new mongoose.Types.ObjectId(collectionId);

    //  FIX: ObjectId safe comparison
    const exists = memory.collections.some(
      (id) => id.toString() === collectionId
    );

    if (!exists) {
      memory.collections.push(objectId);
      await memory.save();
    }

    res.json({
      message: "Added to collection",
      memory,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};