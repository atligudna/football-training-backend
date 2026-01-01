import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/userModel";



export const UserController = {
    async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findById(req.user!.id);

            res.json({
                success: true,
                Data: {
                    id: user!.id,
                    name: user!.name,
                    email: user!.email,
                    role: user!.role,
                    created_at: user!.created_at
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            console.log("USER:", req.user);
            const { name, email } = req.body;
            
            const updated = await UserModel.update(req.user!.id, {name, email});

            res.json({
                success: true,
                data: updated
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteMe( req: AuthRequest, res: Response, next: NextFunction ) {
        try {
            await UserModel.softDelete(req.user!.id);
            res.json({
                success:true,
                message:"Account deleted"
            });
        } catch (error) {
            next(error)
        }
    }
};