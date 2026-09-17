import {
  NextFunction,
  Request,
  Response,
} from "express";

import { PlayerModel } from "../models/playerModel";
import { successResponse } from "../middleware/success";

function getUserId(req: Request) {
  return req.user?.id;
}

export const PlayerController = {
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

      const players =
        await PlayerModel.getAll(userId);

      return successResponse(res, players);
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
          message: "Invalid player id",
        };
      }

      const player =
        await PlayerModel.getById(
          id,
          userId
        );

      if (!player) {
        throw {
          status: 404,
          message: "Player not found",
        };
      }

      return successResponse(res, player);
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

      const player =
        await PlayerModel.create({
          ...req.body,
          createdBy: userId,
        });

      return successResponse(
        res,
        player,
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
          message: "Invalid player id",
        };
      }

      const updated =
        await PlayerModel.update(
          id,
          userId,
          req.body
        );

      if (!updated) {
        throw {
          status: 404,
          message: "Player not found",
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
          message: "Invalid player id",
        };
      }

      const wasDeleted =
        await PlayerModel.remove(
          id,
          userId
        );

      if (!wasDeleted) {
        throw {
          status: 404,
          message: "Player not found",
        };
      }

      return successResponse(res, null);
    } catch (error) {
      next(error);
    }
  },
};