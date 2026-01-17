import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import drillRoutes from "./routes/drillRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import fieldRoutes from "./routes/fieldRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import drillItemRoutes from "./routes/drillItemRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import drillEquipmentRoutes from "./routes/drillEquipmentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";


dotenv.config();

export const app = express();

app.use(express.json());

app.use ("/auth", authRoutes);



app.use("/users", userRoutes);
app.use("/fields", fieldRoutes);
app.use("/categories", categoryRoutes);

app.use("/drills", drillRoutes);
app.use("/drills", drillItemRoutes);
app.use("/drills", drillEquipmentRoutes);

app.use("/equipment", equipmentRoutes);

app.use("/sessions", sessionRoutes);



app.get("/test-protected", requireAuth, (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route!",
        user: req.user
    });
});

app.use(errorHandler);
