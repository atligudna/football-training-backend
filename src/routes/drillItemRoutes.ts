import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { DrillItemController } from "../controllers/drillItemController";
import { validateBody } from "../middleware/validate";
import { drillItemCreateSchema, drillItemUpdateSchema } from "../schemas/drillItemSchema";

const router = Router();

router.get("/:drillId/items", requireAuth, DrillItemController.getAll);

router.post("/:drillId/items", requireAuth, validateBody(drillItemCreateSchema), DrillItemController.create);

router.patch("/items/:id", requireAuth, validateBody(drillItemUpdateSchema), DrillItemController.update)

router.delete("items/:id", requireAuth, DrillItemController.remove);

export default router;