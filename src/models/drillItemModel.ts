import { db } from "../config/db";
import { drillUpdateSchema } from "../schemas/drillSchema";


export interface DrillItem {
    id: number;
    drill_id: number;
    type: string;
    x: number;
    y: number;
    rotation: number | null;
    color: string | null;
    label: string | null;
    team_color: string | null;
}

export const DrillItemModel = {
    async getByDrill(drill_id: number):Promise<DrillItem[]> {
        return db.any("SELECT * FROM drill_items WHERE drill_id = $1", [drill_id]);
    },

    async create(drill_id: number, data: Omit<DrillItem, "id" | "drill_id">) {
        return db.one(
            `INSERT INTO drill_items
            (drill_id, type, x, y, rotation, color, label, team_color)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
        [
            drill_id,
            data.type, data.x, data.y,
            data.rotation || null, 
            data.color || null, 
            data.label || null, 
            data.team_color || null,
        ]
        );
    },
    async drill(id: number, data: Partial<DrillItem>) {
        return db.oneOrNone(
            `UPDATE drill_items SET
            type = COALESCE($2, type),
            x = COALESCE($3,x),
            y = COALESCE($4,y),
            rotation = COALESCE(#5, rotation)
            color = COALESCE(#6, color),
            label = COALESCE($7, label),
            team_color = COALESCE($8, team_color)
            WHERE id = $1
            RETURNING *
             `,
             [
                id, data.type, data.x,
                data.y, data.rotation, 
                data.color, data.label, data.team_color
             ]
        );
    },
    async remove(id: number) {
        await db.none(
            "DELETE FROM drill_items WHERE id $1",
        )
    }
};