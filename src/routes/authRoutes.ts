import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import { validateBody } from "../middleware/validate";

const router = Router();

router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);

export default router