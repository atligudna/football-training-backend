import { db } from "../config/db";


export interface Category {
    id: number;
    name: string;
}

export const CategoryModel = {
    async getAll(): Promise<Category[]> {
        return db.any("SELECT * FROM categories ORDER BY id");
    },
    
    async getById(id: number): Promise<Category | null> {
        return db.oneOrNone("SELECT * FROM categories WHERE id = $1", [id]);
    },

    async create(name: string): Promise<Category> {
        return db.one(
            `INSERT INTO categories (name)
            VALUES ($1)
            RETURNING *`,
            [name]
        );
    },

    async update (id: number, name: string): Promise<Category | null> {
        return db.oneOrNone(
            `UPDATE categories
            SET name = $2, utdated_at = NOW()
            WHERE id = $1
            RETURNING * ,`,
            [id, name]       
        );
    },

    async remove(id: number): Promise<boolean> {
        const result = await db.result(
            `UPDATE categories SET is_deleted = TRUE
            WHERE id = $1`,
            [id]
        );

        return result.rowCount > 0;
    }

};