import { NextFunction, Request, Response } from "express";
import { FieldModel } from "../models/fieldModel";
import { successResponse } from "../middleware/success";



export const FieldController = {
    async getAll (req: Request, res: Response, next: NextFunction) {
        try {
            const fields = await FieldModel.getAll();
            return successResponse(res, fields);
        } catch (error) {
            next(error);
        }
    },
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw { 
                    status: 400, 
                    message: "Invalid field ID" };
            }

            const field = await FieldModel.getById(id);

            if(!field) {
                throw { 
                    status: 404, 
                    message: "Field not found" 
                };
            }
            return successResponse(res, field);
            
        } catch (error) {
            next(error)            
        }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const field = await FieldModel.create(req.body);
            return successResponse(res, field, 201);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw { 
                    status: 400, 
                    message: "Invalid field ID" 
                };
                }

            const updated = await FieldModel.update(id, req.body);

            if(!updated) {
                throw { 
                    status: 404, 
                    message: "Field not found" 
                };
            }
            return successResponse(res, updated);
        } catch (error) {
            next(error);
        }
    },
    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid field id"
                });
            }

            const deleted = await FieldModel.remove(id);
            
            if (!deleted) {
                throw { 
                    status: 400, 
                    message: "Invalid field ID" 
                };
                }

            return successResponse(res, { message: "Field deleted" });
        } catch (error) {
            next(error);
        }
    }
};