import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "../models/categoeyModel";

export const CategoryController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryModel.getAll();
            res.json({success: true, data: categories});
        } catch (error) {
            next(error);            
        }
    },
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const category = await CategoryModel.getById(id);
            
            if(!category) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
                });
            }
            res.json({
                success: true, data: category
            });
        } catch (error) {
            next(error);
        }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;

            const category = await CategoryModel.create(name);

            res.status(201).json({ 
                success: true,
                data: category
            });
        } catch (error) {
            next(error);
        }
    },
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;

            const updated = await CategoryModel.update(id, name);

            if (!updated) {
                return res.status(404).json( {
                    success: false,
                    error: "Category not found"
                });
            }

            res.json( {
                success: true, 
                data: updated
            });
        } catch (error) {
            next(error);
        }
    },
    async remove (req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await CategoryModel.remove(id);

            res.json( {
                success: true,
                message: "Category deleted"
            });
        } catch (error) {
            next(error);
        }
    }
}