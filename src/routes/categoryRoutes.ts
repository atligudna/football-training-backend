import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { requireAuth } from "../middleware/auth";



const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", requireAuth, CategoryController.create);
router.put("/:id", requireAuth, CategoryController.update);
router.delete("/:id", requireAuth, CategoryController.remove);

export default router;