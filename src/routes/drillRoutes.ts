import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { DrillController } from "../controllers/drillController";
import { validateBody } from "../middleware/validate";
import { drillCreateSchema, drillUpdateSchema } from "../schemas/drillSchema";

const router = Router();

router.get("/", DrillController.getAll);
router.get("/:id", DrillController.getById);

router.post(
    "/",
    requireAuth, 
    validateBody(drillCreateSchema),
    DrillController.create
);

router.put(
    "/:id", 
    requireAuth, 
    validateBody(drillUpdateSchema),
    DrillController.update
);


router.delete("/:id", requireAuth, DrillController.remove);

export default router;
