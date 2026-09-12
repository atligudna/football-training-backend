import { Router } from "express";

import { TrainingActivityBlockController } from "../controllers/trainingActivityBlockController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, TrainingActivityBlockController.getById);
router.put("/:id", requireAuth, TrainingActivityBlockController.update);
router.delete("/:id", requireAuth, TrainingActivityBlockController.remove);

export default router;
