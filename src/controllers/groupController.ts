import {
  NextFunction,
  Request,
  Response,
} from "express";

import { GroupModel } from "../models/groupModel";
import { successResponse } from "../middleware/success";

function getUserId(req: Request) {
  return req.user?.id;
}

export const GroupController = {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const groups =
        await GroupModel.getAll(userId);

      return successResponse(res, groups);
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
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        throw {
          status: 400,
          message: "Invalid group id",
        };
      }

      const group =
        await GroupModel.getById(id, userId);

      if (!group) {
        throw {
          status: 404,
          message: "Group not found",
        };
      }

      return successResponse(res, group);
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
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const group =
        await GroupModel.create({
          ...req.body,
          createdBy: userId,
        });

      return successResponse(
        res,
        group,
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
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        throw {
          status: 400,
          message: "Invalid group id",
        };
      }

      const updated =
        await GroupModel.update(
          id,
          userId,
          req.body
        );

      if (!updated) {
        throw {
          status: 404,
          message: "Group not found",
        };
      }

      return successResponse(res, updated);
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
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        throw {
          status: 400,
          message: "Invalid group id",
        };
      }

      const wasDeleted =
        await GroupModel.remove(
          id,
          userId
        );

      if (!wasDeleted) {
        throw {
          status: 404,
          message: "Group not found",
        };
      }

      return successResponse(res, null);
    } catch (error) {
      next(error);
    }
  },
};