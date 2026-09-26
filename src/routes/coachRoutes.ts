import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { CoachController } from "../controllers/coachController";
import {
  coachCreateSchema,
  coachUpdateSchema,
} from "../schemas/coachSchema";

const router = Router();

router.get(
  "/",
  requireAuth,
  CoachController.getAll
);

router.post(
  "/",
  requireAuth,
  validateBody(coachCreateSchema),
  CoachController.create
);

router.get(
  "/:id",
  requireAuth,
  CoachController.getById
);

router.put(
  "/:id",
  requireAuth,
  validateBody(coachUpdateSchema),
  CoachController.update
);

router.delete(
  "/:id",
  requireAuth,
  CoachController.remove
);

export default router;