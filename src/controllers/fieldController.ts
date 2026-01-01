import { NextFunction, Request, Response } from "express";
import { FieldModel } from "../models/fieldModel";



export const FieldController = {
    async getAll (req: Request, res: Response, next: NextFunction) {
        try {
            const fields = await FieldModel.getAll();
            res.json({success: true, data: fields})
        } catch (error) {
            next(error);
        }
    },
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid field id"
                });
            }

            const field = await FieldModel.getById(id);

            if(!field) {
                return res.status(404).json({
                     success: false, 
                     error: "Field not found."
                    });
            }
            res.json({
                success: true,
                data: field
            });
        } catch (error) {
            next(error)            
        }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const field = await FieldModel.create(req.body);
            res.status(201).json({ success: true, data: field});
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid field id"
                 });
                }

            const updated = await FieldModel.update(id, req.body);

            if(!updated) {
                return res.status(404).json({success: false, error: "Field not found"})
            }
            res.json({
                success: true,
                data: updated
            });
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
                return res.status(404).json({ 
                    success: false,
                     message: "Field not found"
                    });
                }

            res.json({ success: true, message: "Field deleted" });
        } catch (error) {
            next(error);
        }
    }
};