import { db } from "../config/db";


export interface Equipment {
    id: number;
    name: string;
    updated_at: Date;
}

export const EquipmentModel = {
    async getAll(): Promise<Equipment[]> {
        return db.any("SELECT * FROM equipment ORDER BY name");
    },

    async create(name: string): Promise<Equipment> {
        return db.one(
            `INSERT INTO equipment (name)
            VALUES ($1)
            RETURNING *`,
            [name]
        );
    },

    async update(id: number, name: string): Promise<Equipment | null> {
        return db.oneOrNone(
            `UPDATE equipment
            SET name = $2, 
            updated_at = NOW()
            WHERE id = $1
            RETURNING *`,
            [id, name]
        );
    },

    async remove(id:number): Promise<void> {
        await db.none(
            `DELETE FROM equipment
            WHERE id = $1`,
            [id]
        );
    }
};