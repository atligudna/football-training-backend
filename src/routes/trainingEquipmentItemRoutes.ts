import { Router } from "express";

import { TrainingEquipmentItemController } from "../controllers/trainingEquipmentItemController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, TrainingEquipmentItemController.getById);
router.put("/:id", requireAuth, TrainingEquipmentItemController.update);
router.delete("/:id", requireAuth, TrainingEquipmentItemController.remove);

export default router;