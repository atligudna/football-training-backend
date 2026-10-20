import {
    NextFunction,
    Request,
    Response,
} from "express";

import { z } from "zod";

import {
    PitchDiagramModel,
} from "../models/pitchDiagramModel";

import {
    successResponse,
} from "../middleware/success";

function getUserId(
    req: Request
) {
    return req.user?.id;
}

const uuidSchema =
    z.string().uuid();

export const PitchDiagramController = {
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Not authenticated",
                });
            }

            const diagrams =
                await PitchDiagramModel.getAll(
                    userId
                );

            return successResponse(
                res,
                diagrams
            );
        } catch (error) {
            next(error);
        }
    },

    async getById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Not authenticated",
                });
            }

            const idResult =
                uuidSchema.safeParse(
                    req.params.id
                );

            if (!idResult.success) {
                throw {
                    status: 400,
                    message:
                        "Invalid pitch diagram id",
                };
            }

            const diagram =
                await PitchDiagramModel.getById(
                    idResult.data,
                    userId
                );

            if (!diagram) {
                throw {
                    status: 404,
                    message:
                        "Pitch diagram not found",
                };
            }

            return successResponse(
                res,
                diagram
            );
        } catch (error) {
            next(error);
        }
    },

    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Not authenticated",
                });
            }

            const diagram =
                await PitchDiagramModel.create({
                    ...req.body,
                    createdBy: userId,
                });

            return successResponse(
                res,
                diagram,
                201
            );
        } catch (error) {
            next(error);
        }
    },
    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Not authenticated",
                });
            }

            const idResult =
                uuidSchema.safeParse(
                    req.params.id
                );

            if (!idResult.success) {
                throw {
                    status: 400,
                    message:
                        "Invalid pitch diagram id",
                };
            }

            const updated =
                await PitchDiagramModel.update(
                    idResult.data,
                    userId,
                    req.body
                );

            if (!updated) {
                throw {
                    status: 404,
                    message:
                        "Pitch diagram not found",
                };
            }

            return successResponse(
                res,
                updated
            );
        } catch (error) {
            next(error);
        }
    },
    async remove(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Not authenticated",
                });
            }

            const idResult =
                uuidSchema.safeParse(
                    req.params.id
                );

            if (!idResult.success) {
                throw {
                    status: 400,
                    message:
                        "Invalid pitch diagram id",
                };
            }

            const wasDeleted =
                await PitchDiagramModel.remove(
                    idResult.data,
                    userId
                );

            if (!wasDeleted) {
                throw {
                    status: 404,
                    message:
                        "Pitch diagram not found",
                };
            }

            return successResponse(
                res,
                null
            );
        } catch (error) {
            next(error);
        }
    },
};