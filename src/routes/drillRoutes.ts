import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { DrillController } from "../controllers/drillController";

const router = Router();

router.get("/", requireAuth, DrillController.getAll);
router.post("/", requireAuth, DrillController.create);
router.delete("/", requireAuth, DrillController.remove);

export default router;
