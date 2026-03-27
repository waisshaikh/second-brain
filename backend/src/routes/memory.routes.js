import {
  saveMemory,
  getMemories,
  deleteMemory,
  archiveMemory,
  searchMemories,
  semanticSearch
} from "../controller/memory.controller.js";


// import { protect } from "../middleware/auth.middleware.js";

import router from "./auth.route.js";

// REMOVE protect from all
router.post("/save", saveMemory);
router.get("/", getMemories);
router.delete("/:id", deleteMemory);
router.patch("/:id/archive", archiveMemory);
router.get("/search", searchMemories);
router.get("/semantic", semanticSearch);

export default router;
