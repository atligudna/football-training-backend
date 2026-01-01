import { db } from "../config/db.js";

export interface Field {
    id: number;
    name: string;
    surface: string;
    width: number;
    height: number;
}

export const FieldModel = {
    async getAll(): Promise<Field[]> {
        return db.any("SELECT * FROM fields ORDER BY id");
    },

    async getById(id: number): Promise<Field | null> {
        return db.oneOrNone("SELECT * FROM WHERE id = $1", [id]);
    },

    async create(data: Omit<Field, "id">): Promise<Field> {
        return db.one(
            `INSERT INTO fields (name, surface, width, height)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [data.name, data.surface, data.width, data.height]
        );
    },
    async update(id: number, data: Partial<Field>): Promise<Field | null> {
        return db.oneOrNone(
            `UPDATE fields
             SET
                name = COALESCE($2, name),
                surface = COALESCE($3, surface),
                width = COALESCE($4, width),
                height = COALESCE($5, height),
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [id, data.name, data.surface, data.width, data.height]
        );
    },

    async remove(id: number): Promise<boolean> {
        const result = await db.query(
            "DELETE FROM fields WHERE id = $1",
            [id]
        );
        return result.rowCount > 0
        
    }
};
