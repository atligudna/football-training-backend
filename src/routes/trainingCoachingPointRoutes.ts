import { Router } from "express";

import { TrainingCoachingPointController } from "../controllers/trainingCoachingPointController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, TrainingCoachingPointController.getById);
router.put("/:id", requireAuth, TrainingCoachingPointController.update);
router.delete("/:id", requireAuth, TrainingCoachingPointController.remove);

export default router;