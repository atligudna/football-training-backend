import { db } from "../config/db.js";

export interface SessionDrill {
    id: number;
    session_id: number;
    drill_id: number;
    order_number: number;
    duration_override: number | null;
}

export const SessionDrillModel = {
    async getBySession(sessionId: number): Promise<SessionDrill[]> {
        return db.any(
            `SELECT * FROM session_drills 
             WHERE session_id = $1
             ORDER BY order_number ASC`,
            [sessionId]
        );
    },

    async addToSession(data: {
        session_id: number;
        drill_id: number;
        order_number: number;
        duration_override?: number | null;
    }): Promise<SessionDrill> {
        return db.one(
            `INSERT INTO session_drills 
                (session_id, drill_id, order_number, duration_override)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                data.session_id,
                data.drill_id,
                data.order_number,
                data.duration_override ?? null
            ]
        );
    }
};
