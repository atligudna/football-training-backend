import { Router } from "express";

import { TrainingActivityController } from "../controllers/trainingActivityController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, TrainingActivityController.getById);
router.put("/:id", requireAuth, TrainingActivityController.update);
router.delete("/:id", requireAuth, TrainingActivityController.remove);

export default router;