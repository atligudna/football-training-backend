import { Router } from "express";

import { TrainingPitchController } from "../controllers/trainingPitchController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, TrainingPitchController.getById);
router.put("/:id", requireAuth, TrainingPitchController.update);
router.delete("/:id", requireAuth, TrainingPitchController.remove);

export default router;