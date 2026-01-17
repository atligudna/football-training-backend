import { NextFunction, Request, Response } from "express";
import { DrillItemModel } from "../models/drillItemModel";
import { successResponse } from "../middleware/success";



export const DrillItemController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const drillId = Number(req.params.drillId);
            if (isNaN(drillId)) {
                throw { 
                    status: 400, 
                    message: "Invalid drillId" 
                };
            }

            const items = await DrillItemModel.getByDrill(drillId);

            return successResponse(res, items);
        } catch (error) {
            next(error);
        }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const drillId = Number(req.params.drillId);
            if (isNaN(drillId)) {
                throw { 
                    status: 400, 
                    message: "Invalid drillId" 
                };
            }

            const item = await DrillItemModel.create(drillId, req.body);

            return successResponse(res, item, 201);
        } catch (error) {
            next(error);
        }
    },
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number( req.params.id);
            if (isNaN(id)) {
                throw { 
                    status: 400, 
                    message: "Invalid id" 
                };
            }

            const updated = await DrillItemModel.update(id, req.body);

            if (!updated) {
                throw { 
                    status: 404, 
                    message: "Drill item not found" 
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
               if (isNaN(id)) {
                throw { 
                    status: 400, 
                    message: "Invalid id" 
                };
            }

            const deleted = await DrillItemModel.remove(id);
            if (!deleted) {
                throw { 
                    status: 404, 
                    message: "Drill item not found" 
                };
            }

            return successResponse(res, { message: "Drill item deleted" });
        } catch (error) {
            next(error);
        }
    }
}