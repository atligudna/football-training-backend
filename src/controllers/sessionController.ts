import { Request, Response, NextFunction } from "express";
import { SessionModel } from "../models/sessionModel.js";
import { SessionDrillModel } from "../models/sessionDrillModel.js";

export const SessionController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const coachId = req.user!.id;

            const sessions = await SessionModel.getAllByCoach(coachId);

            res.json({ success: true, data: sessions });
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const session = await SessionModel.getById(id);
            if (!session) {
                return res.status(404).json({ success: false, message: "Session not found" });
            }

            const drills = await SessionDrillModel.getBySession(id);

            res.json({ success: true, data: { session, drills } });
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

            res.status(201).json({ success: true, data: session });
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const session = await SessionModel.update(id, req.body);
            if (!session) {
                return res.status(404).json({ success: false, message: "Session not found" });
            }

            res.json({ success: true, data: session });
        } catch (err) {
            next(err);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            await SessionModel.remove(id);

            res.json({ success: true, message: "Session deleted" });
        } catch (err) {
            next(err);
        }
    }
};
