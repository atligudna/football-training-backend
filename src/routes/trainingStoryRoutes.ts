import { Router } from "express";
import { TrainingPitchController } from "../controllers/trainingPitchController";
import { TrainingStoryController } from "../controllers/trainingStoryController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, TrainingStoryController.getAll);
router.post("/", requireAuth, TrainingStoryController.create);

router.get("/:storyId/pitches", requireAuth, TrainingPitchController.getForTrainingStory);
router.post("/:storyId/pitches", requireAuth, TrainingPitchController.create);

router.get("/:id", requireAuth, TrainingStoryController.getById);
router.put("/:id", requireAuth, TrainingStoryController.update);
router.delete("/:id", requireAuth, TrainingStoryController.remove);


export default router;