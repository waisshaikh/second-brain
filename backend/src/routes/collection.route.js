import express from "express";
import {
  createCollection,
  getCollections,
  addToCollection,
} from "../controllers/collection.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createCollection);
router.get("/", protect, getCollections);
router.post("/add", protect, addToCollection);

export default router;