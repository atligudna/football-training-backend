import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { PlayerController } from "../controllers/playerController";
import {
  playerCreateSchema,
  playerUpdateSchema,
} from "../schemas/playerSchema";

const router = Router();

router.get(
  "/",
  requireAuth,
  PlayerController.getAll
);

router.post(
  "/",
  requireAuth,
  validateBody(playerCreateSchema),
  PlayerController.create
);

router.get(
  "/:id",
  requireAuth,
  PlayerController.getById
);

router.put(
  "/:id",
  requireAuth,
  validateBody(playerUpdateSchema),
  PlayerController.update
);

router.delete(
  "/:id",
  requireAuth,
  PlayerController.remove
);

export default router;