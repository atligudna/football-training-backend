import { Router } from "express";

import { TrainingStoryController } from "../controllers/trainingStoryController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, TrainingStoryController.getAll);
router.get("/:id", requireAuth, TrainingStoryController.getById);
router.post("/", requireAuth, TrainingStoryController.create);

export default router;