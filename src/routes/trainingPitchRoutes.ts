import { Router } from "express";

import { TrainingActivityBlockController } from "../controllers/trainingActivityBlockController";
import { TrainingPitchController } from "../controllers/trainingPitchController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get(
  "/:pitchId/activity-blocks",
  requireAuth,
  TrainingActivityBlockController.getForPitch
);

router.post(
  "/:pitchId/activity-blocks",
  requireAuth,
  TrainingActivityBlockController.create
);

router.get("/:id", requireAuth, TrainingPitchController.getById);
router.put("/:id", requireAuth, TrainingPitchController.update);
router.delete("/:id", requireAuth, TrainingPitchController.remove);

export default router;