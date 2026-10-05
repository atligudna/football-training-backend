import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  TrainingAttendanceModel,
  type UpdateAttendanceInput,
} from "../models/trainingAttendanceModel";

import { successResponse } from "../middleware/success";

function getUser(req: Request) {
  return req.user;
}

export const TrainingAttendanceController = {
  async getForTrainingStory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Not authenticated",
        });
      }

      const storyId =
        req.params.storyId;

      const exists =
        await TrainingAttendanceModel.storyExists(
          storyId,
          user.email
        );

      if (!exists) {
        return res.status(404).json({
          success: false,
          message:
            "Training story not found",
        });
      }

      const attendance =
        await TrainingAttendanceModel.getForTrainingStory(
          storyId,
          user.email,
          user.id
        );

      return successResponse(
        res,
        attendance
      );
    } catch (error) {
      next(error);
    }
  },

  async updateOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Not authenticated",
        });
      }

      const playerId =
        Number(req.params.playerId);

      if (
        !Number.isInteger(playerId) ||
        playerId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid player id",
        });
      }

      const updated =
        await TrainingAttendanceModel.updateOne(
          req.params.storyId,
          user.email,
          user.id,
          {
            playerId,
            status:
              req.body.status,
            notes:
              req.body.notes,
          }
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message:
            "Training story or player not found in this training story",
        });
      }

      return successResponse(
        res,
        updated
      );
    } catch (error) {
      next(error);
    }
  },

  async updateMany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Not authenticated",
        });
      }

      const inputs: UpdateAttendanceInput[] =
        req.body.attendance;

      const updated =
        await TrainingAttendanceModel.updateMany(
          req.params.storyId,
          user.email,
          user.id,
          inputs
        );

      if (!updated) {
        return res.status(400).json({
          success: false,
          message:
            "One or more players do not belong to this training story",
        });
      }

      return successResponse(
        res,
        updated
      );
    } catch (error) {
      next(error);
    }
  },
};