import { NextFunction, Request, Response } from "express";
import { EquipmentModel } from "../models/equipmentModel";
import { successResponse } from "../middleware/success";


export const EquipmentController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await EquipmentModel.getAll();
            return successResponse(res, items);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const item = await EquipmentModel.create(name);
            return successResponse(res, item, 201);
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
                throw { 
                    status: 404, 
                    message: "Equipment entry not found" 
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
            await EquipmentModel.remove(id);
            return successResponse(res, { message: "Equipment removed" });
        } catch (error) {
            next(error);
        }
    }
}