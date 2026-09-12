import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingActivity,
  deleteTrainingActivityByIdAndOwnerEmail,
  getActivitiesByActivityBlockId,
  getActivityByIdAndOwnerEmail,
  updateTrainingActivity,
} from "../models/trainingActivityModel";

export const TrainingActivityController = {
  async getForActivityBlock(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const activities = await getActivitiesByActivityBlockId(
      req.params.blockId,
      req.user.email
    );

    return res.json({
      success: true,
      data: activities,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const activity = await getActivityByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.json({
      success: true,
      data: activity,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const activity = await createTrainingActivity({
      activityBlockId: req.params.blockId,
      ownerEmail: req.user.email,
      title: req.body.title,
      type: req.body.type,
      description: req.body.description ?? "",
      durationMinutes: Number(req.body.durationMinutes),
      notes: req.body.notes,
      orderIndex: Number(req.body.orderIndex ?? 1),
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity block not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: activity,
    });
  },

  async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingActivity = await getActivityByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!existingActivity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const updatedActivity = await updateTrainingActivity({
      id: req.params.id,
      ownerEmail: req.user.email,
      title: req.body.title ?? existingActivity.title,
      type: req.body.type ?? existingActivity.type,
      description: req.body.description ?? existingActivity.description,
      durationMinutes: Number(
        req.body.durationMinutes ?? existingActivity.duration_minutes
      ),
      notes: req.body.notes ?? existingActivity.notes,
      orderIndex: Number(req.body.orderIndex ?? existingActivity.order_index),
    });

    return res.json({
      success: true,
      data: updatedActivity,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await deleteTrainingActivityByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.json({
      success: true,
      message: "Activity deleted",
    });
  },
};