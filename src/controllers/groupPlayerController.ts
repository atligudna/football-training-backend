import {
  NextFunction,
  Request,
  Response,
} from "express";

import { GroupPlayerModel } from "../models/groupPlayerModel";
import { successResponse } from "../middleware/success";

function getUserId(req: Request) {
  return req.user?.id;
}

function getIds(req: Request) {
  return {
    groupId: Number(req.params.id),
    playerId: Number(req.params.playerId),
  };
}

export const GroupPlayerController = {
  async getPlayers(
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

      const groupId = Number(req.params.id);

      if (Number.isNaN(groupId)) {
        throw {
          status: 400,
          message: "Invalid group id",
        };
      }

      const players =
        await GroupPlayerModel.getPlayers(
          groupId,
          userId
        );

      if (!players) {
        throw {
          status: 404,
          message: "Group not found",
        };
      }

      return successResponse(res, players);
    } catch (error) {
      next(error);
    }
  },

  async addPlayer(
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

      const { groupId, playerId } = getIds(req);

      if (
        Number.isNaN(groupId) ||
        Number.isNaN(playerId)
      ) {
        throw {
          status: 400,
          message: "Invalid group or player id",
        };
      }

      const result =
        await GroupPlayerModel.addPlayer(
          groupId,
          playerId,
          userId
        );

      if (result === "group-not-found") {
        throw {
          status: 404,
          message: "Group not found",
        };
      }

      if (result === "player-not-found") {
        throw {
          status: 404,
          message: "Player not found",
        };
      }

      if (result === "exists") {
        return successResponse(res, {
          groupId: String(groupId),
          playerId: String(playerId),
          alreadyMember: true,
        });
      }

      return successResponse(
        res,
        {
          groupId: String(groupId),
          playerId: String(playerId),
          alreadyMember: false,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  },

  async removePlayer(
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

      const { groupId, playerId } = getIds(req);

      if (
        Number.isNaN(groupId) ||
        Number.isNaN(playerId)
      ) {
        throw {
          status: 400,
          message: "Invalid group or player id",
        };
      }

      const result =
        await GroupPlayerModel.removePlayer(
          groupId,
          playerId,
          userId
        );

      if (result === "group-not-found") {
        throw {
          status: 404,
          message: "Group not found",
        };
      }

      if (result === "player-not-found") {
        throw {
          status: 404,
          message: "Player not found",
        };
      }

      if (result === "not-member") {
        throw {
          status: 404,
          message: "Player is not a member of this group",
        };
      }

      return successResponse(res, null);
    } catch (error) {
      next(error);
    }
  },
};