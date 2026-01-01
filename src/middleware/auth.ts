import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";


const SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Missing or invalid Authorization header"
            });
        }
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, SECRET) as { id:number; role: string} ;

        const user = await UserModel.findById(payload.id);

        if(!user || user.is_deleted) {
            return res.status(401).json({
                success: false,
                message: "User no longar exists"
            });
        }

        req.user = {
            id: user.id,
            role: user.role
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin privileges required"
        });
    }
    next();
};