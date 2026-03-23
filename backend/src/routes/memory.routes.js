import {
  saveMemory,
  getMemories,
  deleteMemory,
  archiveMemory,
} from "../controllers/memory.controller.js";

router.post("/save", protect, saveMemory);
router.get("/", protect, getMemories);
router.delete("/:id", protect, deleteMemory);
router.patch("/:id/archive", protect, archiveMemory);