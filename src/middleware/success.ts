import { Response } from "express";

export const successResponse = (
    res: Response,
    data: any,
    status = 200
) => {
    return res.status(status).json({
        success: true,
        data,
    });
}