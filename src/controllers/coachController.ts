import {
  NextFunction,
  Request,
  Response,
} from "express";

import { CoachModel } from "../models/coachModel";
import { successResponse } from "../middleware/success";

function getUserId(req: Request) {
  return req.user?.id;
}

export const CoachController = {
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

      const coaches =
        await CoachModel.getAll(
          userId
        );

      return successResponse(
        res,
        coaches
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

      const id = Number(
        req.params.id
      );

      if (Number.isNaN(id)) {
        throw {
          status: 400,
          message:
            "Invalid coach id",
        };
      }

      const coach =
        await CoachModel.getById(
          id,
          userId
        );

      if (!coach) {
        throw {
          status: 404,
          message:
            "Coach not found",
        };
      }

      return successResponse(
        res,
        coach
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

      const coach =
        await CoachModel.create({
          ...req.body,
          createdBy: userId,
        });

      return successResponse(
        res,
        coach,
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

      const id = Number(
        req.params.id
      );

      if (Number.isNaN(id)) {
        throw {
          status: 400,
          message:
            "Invalid coach id",
        };
      }

      const updated =
        await CoachModel.update(
          id,
          userId,
          req.body
        );

      if (!updated) {
        throw {
          status: 404,
          message:
            "Coach not found",
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

      const id = Number(
        req.params.id
      );

      if (Number.isNaN(id)) {
        throw {
          status: 400,
          message:
            "Invalid coach id",
        };
      }

      const wasDeleted =
        await CoachModel.remove(
          id,
          userId
        );

      if (!wasDeleted) {
        throw {
          status: 404,
          message:
            "Coach not found",
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