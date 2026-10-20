import { Router } from "express";

import {
  requireAuth,
} from "../middleware/auth";

import {
  validateBody,
} from "../middleware/validate";

import {
  PitchDiagramController,
} from "../controllers/pitchDiagramController";

import {
  pitchDiagramCreateSchema,
  pitchDiagramUpdateSchema,
} from "../schemas/pitchDiagramSchema";

const router = Router();

router.get(
  "/",
  requireAuth,
  PitchDiagramController.getAll
);

router.post(
  "/",
  requireAuth,
  validateBody(
    pitchDiagramCreateSchema
  ),
  PitchDiagramController.create
);

router.get(
  "/:id",
  requireAuth,
  PitchDiagramController.getById
);

router.put(
  "/:id",
  requireAuth,
  validateBody(
    pitchDiagramUpdateSchema
  ),
  PitchDiagramController.update
);

router.delete(
  "/:id",
  requireAuth,
  PitchDiagramController.remove
);

export default router;