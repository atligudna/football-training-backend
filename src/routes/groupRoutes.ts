import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

import { GroupController } from "../controllers/groupController";
import { GroupPlayerController } from "../controllers/groupPlayerController";

import {
  groupCreateSchema,
  groupUpdateSchema,
} from "../schemas/groupSchema";

const router = Router();

router.get(
  "/",
  requireAuth,
  GroupController.getAll
);

router.post(
  "/",
  requireAuth,
  validateBody(groupCreateSchema),
  GroupController.create
);

router.get(
  "/:id/players",
  requireAuth,
  GroupPlayerController.getPlayers
);

router.post(
  "/:id/players/:playerId",
  requireAuth,
  GroupPlayerController.addPlayer
);

router.delete(
  "/:id/players/:playerId",
  requireAuth,
  GroupPlayerController.removePlayer
);

router.get(
  "/:id",
  requireAuth,
  GroupController.getById
);

router.put(
  "/:id",
  requireAuth,
  validateBody(groupUpdateSchema),
  GroupController.update
);

router.delete(
  "/:id",
  requireAuth,
  GroupController.remove
);

export default router;