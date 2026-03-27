import express from "express";
const router = express.Router();

import {
  saveMemory,
  getMemories,
  deleteMemory,
  archiveMemory,
  searchMemories,
  semanticSearch,
  getRelatedMemories,
  getClusters,
  getGraphData,
  getResurfacedMemories,
} from "../controllers/memory.controller.js";

import { protect } from "../middleware/auth.middleware.js";

// ALL ROUTES PROTECTED 
router.post("/save", protect, saveMemory);
router.get("/", protect, getMemories);
router.delete("/:id", protect, deleteMemory);
router.patch("/:id/archive", protect, archiveMemory);

router.get("/search", protect, searchMemories);
router.get("/semantic", protect, semanticSearch);

// NEW AI ROUTES 
router.get("/:id/related", protect, getRelatedMemories);
router.get("/clusters", protect, getClusters);
router.get("/resurface", protect, getResurfacedMemories);

router.get("/graph", protect, getGraphData);

export default router;