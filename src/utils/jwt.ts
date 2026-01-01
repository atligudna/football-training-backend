import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: number, role: string) {
    return jwt.sign(
        { id: userId, role },
        SECRET,
        { expiresIn: "7d" }
    );
}