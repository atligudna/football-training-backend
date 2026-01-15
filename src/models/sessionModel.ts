import { db } from "../config/db";


export interface Session   {
    id: number;
    coach_id: number;
    field_id: number | null;
    title: String;
    date: Date;
    total_duration: Number  | null;
    notes: string | null;
    updated_at: Date;
    is_deleted: boolean;
}

export const SessionModel = {
    async getAllByCoach(coach_id: number): Promise<Session[]> {
        return db.any(
            `SELECT * FROM sessions
            WHERE coach_id = $1 AND is_deleted = FALSE
            ORDER BY date DESC`,
            [coach_id]
        );
    },
    async getById(id:number): Promise<Session | null> {
        return db.oneOrNone(
            `SELECT * FROM sessions
            WHERE id = $1 AND is_deleted = FALSE`,
            [id] 
        );
    },
    async create(data: {
        coach_id: number;
        field_id?: number;
        title: string;
        date: string;
        total_duration?: number;
        notes?: string;
    }): Promise<Session> {
        return db.one(
            `INSERT INTO sessions
        (coach_id, field_id, title, date, total_duration, notes)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`,
            [
                data.coach_id,
                data.field_id ?? null,
                data.title,
                data.date,
                data.total_duration ?? null,
                data.notes ?? null
            ]
        );
    },
    async update(id:number, data: Partial<Session>): Promise<Session | null> {
        return db.oneOrNone(
        `UPDATE sessions SET
            field_id = COALESCE($2, field_id),
            title = COALESCE($3, title),
            date = COALESCE($4, date),
            total_duration = COALESCE($5, total_duration),
            updated_at = NOW()
        WHERE id = $1 AND is_deleted = FALSE
        RETURNING *
        `,
        [
            id,
            data.field_id,
            data.title,
            data.date,
            data.total_duration,
            data.notes
        ]
        );
    },
    async remove(id: number): Promise<void> {
        await db.none(
            `UPDATE sessions
            SET is_deleted = TRUE
            WHERE id = $1`,
            [id]
        );
    }
};