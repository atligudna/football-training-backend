import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { SessionDrillController } from "../controllers/sessionDrillController.js";

const router = Router();

router.patch(
    "/:id/reorder", 
    requireAuth, 
    SessionDrillController.reorder
);

router.patch(
    "/:id/duration",
    requireAuth, 
    SessionDrillController.updateDuration
);

router.patch(
    "/:id/replace",
    requireAuth, 
    SessionDrillController.replace
);

router.delete(
    "/:id",
    requireAuth,
    SessionDrillController.remove
);

export default router;
