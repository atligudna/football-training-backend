import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { DrillController } from "../controllers/drillController";
import { validateBody } from "../middleware/validate";
import {
  drillCreateSchema,
  drillUpdateSchema,
} from "../schemas/drillSchema";

const router = Router();

router.get(
  "/history",
  requireAuth,
  DrillController.getHistory
);

router.get("/", requireAuth, DrillController.getAll);

router.post(
  "/",
  requireAuth,
  validateBody(drillCreateSchema),
  DrillController.create
);

router.post(
  "/:id/restore",
  requireAuth,
  DrillController.restore
);

router.get("/:id", requireAuth, DrillController.getById);

router.put(
  "/:id",
  requireAuth,
  validateBody(drillUpdateSchema),
  DrillController.update
);

router.delete(
  "/:id",
  requireAuth,
  DrillController.remove
);

export default router;