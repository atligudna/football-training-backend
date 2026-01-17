import { Request, Response, NextFunction } from "express";
import { DrillEquipmentModel } from "../models/drillEquipmentModel.js";
import { successResponse } from "../middleware/success.js";

export const DrillEquipmentController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const drillId = Number(req.params.drillId);
            const items = await DrillEquipmentModel.getByDrill(drillId);

            return successResponse(res, items);

        } catch (error) { 
            next(error); 
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const drill_id = Number(req.params.drillId);
            const { equipment_id, quantity } = req.body;

            const item = await DrillEquipmentModel.create({
                drill_id,
                equipment_id,
                quantity
            });

            return successResponse(res, item, 201);
        } catch (error) { 
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { quantity } = req.body;

            const updated = await DrillEquipmentModel.update(id, quantity);

            if (!updated) {
                throw { 
                    status: 404, 
                    message: "Equipment assignment not found" 
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
            const deleted = await DrillEquipmentModel.remove(id);
            if (!deleted) {
                throw { 
                    status: 404, 
                    message: "Equipment assignment not found" 
                };
            }

            return successResponse(res, { message: "Equipment removed" });
        } catch (error) { 
            next(error); 
        }
    }
};
