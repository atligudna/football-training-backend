import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";


export const AuthController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            
            const existing = await UserModel.findByEmail(email);
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }
            
            const password_hash = await bcrypt.hash(password, 10);
            const user = await UserModel.create({
                name, 
                email,
                password_hash,
                role: "coach"
            });
            
            const { password_hash: _, ...safeUser } = user; 

            res.status(201).json({
                success: true,
                data: safeUser,
            });
        } catch (error) {
            next(error);
        }
    },

    async login( req: Request, res: Response, next: NextFunction) {
      try {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if(!user || user.is_deleted)  {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        
        const match = await bcrypt.compare(password, user.password_hash);
        if(!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign(
            {userId: user.id,role: user.role},
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            token
        });
      } catch (error) {
        next(error);
      }  
    }
};