import { Router } from "express";

import { TrainingPlayerFocusController } from "../controllers/trainingPlayerFocusController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, TrainingPlayerFocusController.getById);
router.put("/:id", requireAuth, TrainingPlayerFocusController.update);
router.delete("/:id", requireAuth, TrainingPlayerFocusController.remove);

export default router;