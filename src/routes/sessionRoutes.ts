import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SessionController } from "../controllers/sessionController";
import { validateBody } from "../middleware/validate";
import { sessionCreateSchema, sessionUpdateSchema } from "../schemas/sessionSchemas";


const router = Router();

router.use(requireAuth);

router.get("/", SessionController.getAll);

router.get("/:id", SessionController.getById);

router.post(
    "/", 
    requireAuth,
    validateBody(sessionCreateSchema),
    SessionController.create
);

router.patch(
    "/:id",
    requireAuth,
    validateBody(sessionUpdateSchema),
    SessionController.update
);

router.delete(
    "/:id",
    requireAuth,
    SessionController.remove);

export default router;

