import { NextFunction, Request, Response } from "express";
import { DrillItemModel } from "../models/drillItemModel";



export const DrillItemController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const drillId = Number(req.params.drillId);
            const items = await DrillItemModel.getByDrill(drillId);

            res.json({ success: true, data: items });
        } catch (error) {
            next(error);
        }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const drillId = Number(req.params.drillId);
            const item = await DrillItemModel.create(drillId, req.body);

            res.status(201).json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    },
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number( req.params.id);
            const updated = await DrillItemModel.update(id, req.body);

            res.json({ success: true, data: updated});
        } catch (error) {
            next(error);
        }
    },
    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await DrillItemModel.remove(id);

            res.json({ success: true, message: "Item deleted"});
        } catch (error) {
            next(error);
        }
    }
}