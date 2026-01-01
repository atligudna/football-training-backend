import { create } from "node:domain";
import { db } from "../config/db.js";



export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    is_deleted: boolean;
    created_at: string;
}

export const UserModel = {
    async create(data: {
        name: string;
        email: string;
        password_hash: string;
        role: string;
    }): Promise<User> {
        return db.one(
            `INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [data.name, data.email, data.password_hash, data.role]
        );
    },
    async findByEmail(email: string): Promise<User | null> {
        return db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
    },
    async findById(id: number): Promise<User | null> {
        return db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);
    },
    async update(id: number, data: {name?: string, email?: string}) {
        return db.one(
            `UPDATE users
            SET
                name = COALESCE($2, name),
                email = COALESCE($3, email),
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, name, email, role, created_at`,
            [id, data.name, data.email]
        );
    },
    async softDelete(id: number) {
    return db.none(
        `UPDATE users 
         SET is_deleted = TRUE, updated_at = NOW()
         WHERE id = $1`,
        [id]
    );
}
};