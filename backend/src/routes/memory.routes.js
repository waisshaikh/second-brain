import {
  saveMemory,
  getMemories,
  deleteMemory,
  archiveMemory,
  searchMemories
} from "../controller/memory.controller.js";

import { protect } from "../middleware/auth.middleware.js";


import router from "./auth.route.js";

router.post("/save", protect, saveMemory);
router.get("/", protect, getMemories);
router.delete("/:id", protect, deleteMemory);
router.patch("/:id/archive", protect, archiveMemory);
router.get("/search", protect, searchMemories);

export default router