import { db } from "../config/db";


export interface Drill {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number | null;
    difficulty: "easy" | "medium" | "hard";
    popularity: number;
    category_id: number | null;
    field_id: number | null;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}

export const DrillModel = {
    async getAll(): Promise<Drill[]> {
        return db.any("SELECT * FROM drills WHERE is_deleted = FALSE ORDER BY id");
    },

    async getById(id:number): Promise<Drill | null> {
        return db.oneOrNone(
            "SELECT * FROM drills WHERE id = $1 AND is_deleted = FALSE", [id]
        );
    },

    async create(data: {
        name: string,
        description?: string,
        duration_minutes?: number,
        difficulty: "easy" | "medium" | "hard",
        category_id?: number,
        field_id?: number,
        created_by: number,
        popularity?: number
    }): Promise<Drill> {
        return db.one(
            `INSERT INTO drills 
             (name, description, duration_minutes, difficulty, category_id, field_id, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                data.name,
                data.description || null,
                data.duration_minutes || null,
                data.difficulty,
                data.category_id || null,
                data.field_id || null,
                data.created_by,
                data.popularity ?? 0
            ]
        );
    },
    async update(id: number, data: Partial<Drill>): Promise<Drill | null> {
        return db.oneOrNone(
            `UPDATE drills SET
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                duration_minutes = COALESCE($4, duration_minutes),
                difficulty = COALESCE($5, difficulty),
                category_id = COALESCE($6, category_id),
                field_id = COALESCE($7, field_id),
                updated_at = NOW()
             WHERE id = $1 AND is_deleted = FALSE
             RETURNING *`,
            [
                id,
                data.name,
                data.description,
                data.duration_minutes,
                data.difficulty,
                data.category_id,
                data.field_id,
                data.popularity
            ]
        );
    },

    async remove(id: number): Promise<void> {
        await db.none(
            `UPDATE drills 
            SET is_deleted = TRUE 
            WHERE id = $1`,
            [id]
        );
    }
};