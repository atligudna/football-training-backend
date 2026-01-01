import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { UserController } from "../controllers/userControllers";

const router = Router();

router.get("/me", requireAuth, UserController.getMe);
router.put("/me", requireAuth, UserController.updateMe);
router.delete("/me", requireAuth, UserController.deleteMe);

export default router;