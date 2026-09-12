import { Router } from "express";

import { TrainingActivityController } from "../controllers/trainingActivityController";
import { TrainingCoachingPointController } from "../controllers/trainingCoachingPointController";
import { TrainingEquipmentItemController } from "../controllers/trainingEquipmentItemController";
import { TrainingPlayerFocusController } from "../controllers/trainingPlayerFocusController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get(
  "/:activityId/coaching-points",
  requireAuth,
  TrainingCoachingPointController.getForActivity
);

router.post(
  "/:activityId/coaching-points",
  requireAuth,
  TrainingCoachingPointController.create
);

router.get(
  "/:activityId/player-focus",
  requireAuth,
  TrainingPlayerFocusController.getForActivity
);

router.post(
  "/:activityId/player-focus",
  requireAuth,
  TrainingPlayerFocusController.create
);

router.get(
  "/:activityId/equipment-items",
  requireAuth,
  TrainingEquipmentItemController.getForActivity
);

router.post(
  "/:activityId/equipment-items",
  requireAuth,
  TrainingEquipmentItemController.create
);

router.get("/:id", requireAuth, TrainingActivityController.getById);
router.put("/:id", requireAuth, TrainingActivityController.update);
router.delete("/:id", requireAuth, TrainingActivityController.remove);

export default router;