import { NextFunction, Request, Response } from "express";
import { SessionDrillModel } from "../models/sessionDrillModel";
import { successResponse } from "../middleware/success";

export const SessionDrillController = {
    async reorder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { new_order } = req.body;

            const updated = await SessionDrillModel.updateOrder(id, new_order);
            return successResponse(res, updated);
        } catch (error) {
            next(error);
        }
    },

    async updateDuration(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number (req.params.id);
            const { duration_override } = req.body;
            
            const updated = await SessionDrillModel.updateDuration(id, duration_override);
            return successResponse(res, updated, 201);
        } catch (error) {
            next(error);
        }
    },

    async replace(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { drill_id } = req.body;

            const updated = await SessionDrillModel.replaceDrill(id, drill_id);
            return successResponse(res, updated, 201);
        } catch (error) {
            next(error);
        }

    },
    async remove( req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await SessionDrillModel.remove(id);

            return successResponse(res, { message: "Drill removed from session" });
        } catch (error) {
            
        }
    }
}