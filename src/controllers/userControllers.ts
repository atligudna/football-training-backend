import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/userModel";
import { successResponse } from "../middleware/success";



export const UserController = {
    async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findById(req.user!.id);

            return successResponse(res, user);
        } catch (error) {
            next(error);
        }
    },

    async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            console.log("USER:", req.user);
            const { name, email } = req.body;
            
            const updated = await UserModel.update(req.user!.id, {name, email});

            return successResponse(res, updated);
        } catch (error) {
            next(error);
        }
    },

    async deleteMe( req: AuthRequest, res: Response, next: NextFunction ) {
        try {
            await UserModel.softDelete(req.user!.id);
            return successResponse(res, { message: "Account deleted" });
        } catch (error) {
            next(error)
        }
    }
};