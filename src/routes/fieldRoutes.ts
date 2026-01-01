import { Router } from "express";
import { FieldController } from "../controllers/fieldController";
import { requireAuth } from "../middleware/auth";


const router = Router();

router.get("/", FieldController.getAll);
router.get("/:id", FieldController.getById);
router.post("/", requireAuth, FieldController.create);
router.put("/:id", requireAuth, FieldController.update);
router.delete("/:id", requireAuth, FieldController.remove);

export default router;