import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { EquipmentController } from "../controllers/equipmentController";
import { validateBody } from "../middleware/validate";
import { equipmentCreateSchema, equipmentUpdateSchema } from "../schemas/equipmentSchemas";

const router = Router();

router.get(
    "/",
    requireAuth,
    EquipmentController.getAll
);

router.post(
    "/",
    requireAuth,
    validateBody(equipmentCreateSchema),
    EquipmentController.create
);

router.patch(
    "/:id",
    requireAuth,
    validateBody(equipmentUpdateSchema),
    EquipmentController.update
);

router.delete(
    "/:id",
    requireAuth,
    EquipmentController.remove
);

export default router;