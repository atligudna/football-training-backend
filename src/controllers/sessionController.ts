import { Request, Response, NextFunction } from "express";
import { SessionModel } from "../models/sessionModel.js";
import { SessionDrillModel } from "../models/sessionDrillModel.js";
import { successResponse } from "../middleware/success.js";

export const SessionController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const coachId = req.user!.id;

            const sessions = await SessionModel.getAllByCoach(coachId);

            return successResponse(res, sessions);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const session = await SessionModel.getById(id);
            if (!session) {
                throw { 
                    status: 404, 
                    message: "Session not found" 
                };
            }

            const drills = await SessionDrillModel.getBySession(id);

            return successResponse(res, { session, drills });
        } catch (err) {
            next(err);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const coach_id = req.user!.id;

            const { field_id, title, date, total_duration, notes, drills } = req.body;

            const session = await SessionModel.create({
                coach_id,
                field_id,
                title,
                date,
                total_duration,
                notes
            });

            if (Array.isArray(drills)) {
                for (const d of drills) {
                    await SessionDrillModel.addToSession({
                        session_id: session.id,
                        drill_id: d.drill_id,
                        order_number: d.order_number,
                        duration_override: d.duration_override ?? null
                    });
                }
            }

            return successResponse(res, session, 201);
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const session = await SessionModel.update(id, req.body);
            if (!session) {
                throw { 
                    status: 404, 
                    message: "Session not found"
                };
            }
        
            return successResponse(res, session);
        } catch (err) {
            next(err);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            await SessionModel.remove(id);

            return successResponse(res, { message: "Session deleted" });
        } catch (err) {
            next(err);
        }
    }
};
