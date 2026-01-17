import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "../models/categoeyModel";
import { successResponse } from "../middleware/success";

export const CategoryController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryModel.getAll();
            return successResponse(res, categories);
        } catch (error) {
            next(error);            
        }
    },
    
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const category = await CategoryModel.getById(id);
            
            if(!category) {
                throw { 
                    status: 400, 
                    message: "Category already exists" 
                };
            }
            
            return successResponse(res, category, 201);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;

            const category = await CategoryModel.create(name);

            return successResponse(res, category, 201);
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
                throw { 
                    status: 404, 
                    message: "Category not found" 
                };
            }

            return successResponse(res, updated);
        } catch (error) {
            next(error);
        }
    },
    
    async remove (req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            
            const deleted = await CategoryModel.remove(id);

            if (!deleted) {
                throw { 
                    status: 404, 
                    message: "Category not found" };
            }

            return successResponse(res, { message: "Category deleted" });
        } catch (error) {
            next(error);
        }
    }
}