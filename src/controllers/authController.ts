import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { successResponse } from "../middleware/success";


export const AuthController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            
            const existing = await UserModel.findByEmail(email);
            if (existing) {
                throw { 
                    status: 400, 
                    message: "Email already registered" };
            }
            
            const password_hash = await bcrypt.hash(password, 10);
            const user = await UserModel.create({
                name, 
                email,
                password_hash,
                role: "coach"
            });
            
            const { password_hash: _, ...safeUser } = user; 

            return successResponse(
                res, safeUser, 201
            );

        } catch (error) {
            next(error);
        }
    },

    async login( req: Request, res: Response, next: NextFunction) {
      try {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if(!user || user.is_deleted)  {
            throw { 
                status: 401, 
                message: "Invalid login credentials" 
            };
        }
        
        const match = await bcrypt.compare(password, user.password_hash);
        if(!match) {
            throw { 
                status: 401, 
                message: "Invalid login credentials" 
            };
        }


        const token = generateToken(user.id, user.role);

        const { password_hash, ...safeUser } = user;

        return successResponse(res, {
                token,
                user: safeUser
            });
      } catch (error) {
        next(error);
      }  
    }
};