import { Router } from "express";

import { TrainingActivityBlockController } from "../controllers/trainingActivityBlockController";
import { TrainingActivityController } from "../controllers/trainingActivityController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get(
  "/:blockId/activities",
  requireAuth,
  TrainingActivityController.getForActivityBlock
);

router.post(
  "/:blockId/activities",
  requireAuth,
  TrainingActivityController.create
);

router.get("/:id", requireAuth, TrainingActivityBlockController.getById);
router.put("/:id", requireAuth, TrainingActivityBlockController.update);
router.delete("/:id", requireAuth, TrainingActivityBlockController.remove);

export default router;