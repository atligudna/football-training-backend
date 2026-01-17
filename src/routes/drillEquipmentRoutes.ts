import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { DrillEquipmentController } from "../controllers/drillEquipmentController.js";
import { validateBody } from "../middleware/validate.js";
import { drillEquipmentCreateSchema, drillEquipmentUpdateSchema } from "../schemas/drillEquipmentSchemas.js";

const router = Router();

// /drills/:drillId/equipment
router.get(
    "/:drillId/equipment", 
    requireAuth, 
    DrillEquipmentController.getAll);

router.post(
    "/:drillId/equipment",
    requireAuth,
    validateBody(drillEquipmentCreateSchema),
    DrillEquipmentController.create
);

router.patch(
    "/equipment/:id",
    requireAuth,
    validateBody(drillEquipmentUpdateSchema),
    DrillEquipmentController.update
);

router.delete(
    "/equipment/:id",
    requireAuth,
    DrillEquipmentController.remove
);

export default router;
