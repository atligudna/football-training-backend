import { NextFunction, Request, Response } from "express";
import { EquipmentModel } from "../models/equipmentModel";


export const EquipmentController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await EquipmentModel.getAll();
            res.json({ 
                success: true, 
                data: items });
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const item = await EquipmentModel.create(name);
            res.status(201).json({ 
                success: true, 
                data: item
            });
        } catch (error) {
            next(error);
        }
    },

    async update (req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;

            const updated = await EquipmentModel.update(id, name);

            if(!updated) {
                return res.status(404).json({
                    success: false, 
                    message: "Item not found"
                })
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
            await EquipmentModel.remove(id);
            res.json({ 
                success: true, 
                message: "Equipment deleted" 
            });
        } catch (error) {
            next(error);
        }
    }
}