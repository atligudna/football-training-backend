import { db } from "../config/db.js";

export interface DrillEquipment {
    id: number;
    drill_id: number;
    equipment_id: number;
    quantity: number;
    updated_at: Date;
}

export const DrillEquipmentModel = {
    async getByDrill(drill_id: number): Promise<DrillEquipment[]> {
        return db.any(
            `SELECT de.*, e.name AS equipment_name
             FROM drill_equipment de
             JOIN equipment e ON e.id = de.equipment_id
             WHERE drill_id = $1
             ORDER BY de.id`,
            [drill_id]
        );
    },

    async create(data: {
        drill_id: number;
        equipment_id: number;
        quantity: number;
    }): Promise<DrillEquipment> {
        return db.one(
            `INSERT INTO drill_equipment (drill_id, equipment_id, quantity)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [data.drill_id, data.equipment_id, data.quantity]
        );
    },

    async update(id: number, quantity: number): Promise<DrillEquipment | null> {
        return db.oneOrNone(
            `UPDATE drill_equipment
             SET quantity = $2, updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [id, quantity]
        );
    },

     async remove(id: number): Promise<boolean> {
        const result = await db.result(
            `DELETE FROM drill_equipment 
            WHERE id = $1`,
            [id]
        );

        return result.rowCount > 0;
    }
};
