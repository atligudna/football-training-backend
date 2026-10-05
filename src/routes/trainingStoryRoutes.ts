import { Router } from "express";
import { TrainingPitchController } from "../controllers/trainingPitchController";
import { TrainingStoryController } from "../controllers/trainingStoryController";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  TrainingAttendanceController,
} from "../controllers/trainingAttendanceController";

import {
  attendanceBulkUpdateSchema,
  attendanceUpdateSchema,
} from "../schemas/trainingAttendanceSchema";

const router = Router();

router.get("/", requireAuth, TrainingStoryController.getAll);
router.post("/", requireAuth, TrainingStoryController.create);

router.post("/full", requireAuth, TrainingStoryController.createFull);

router.get("/:storyId/pitches", requireAuth, TrainingPitchController.getForTrainingStory);
router.post("/:storyId/pitches", requireAuth, TrainingPitchController.create);

router.get("/:id/full", requireAuth, TrainingStoryController.getFullById);
router.put("/:id/full", requireAuth, TrainingStoryController.updateFull);

router.get("/:id", requireAuth, TrainingStoryController.getById);
router.put("/:id", requireAuth, TrainingStoryController.update);
router.delete("/:id", requireAuth, TrainingStoryController.remove);

router.get(
  "/:storyId/attendance",
  requireAuth,
  TrainingAttendanceController.getForTrainingStory
);

router.put(
  "/:storyId/attendance/:playerId",
  requireAuth,
  validateBody(
    attendanceUpdateSchema
  ),
  TrainingAttendanceController.updateOne
);

router.put(
  "/:storyId/attendance",
  requireAuth,
  validateBody(
    attendanceBulkUpdateSchema
  ),
  TrainingAttendanceController.updateMany
);

export default router;