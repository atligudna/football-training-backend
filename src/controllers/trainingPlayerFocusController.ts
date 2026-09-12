import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingPlayerFocus,
  deleteTrainingPlayerFocusByIdAndOwnerEmail,
  getPlayerFocusByActivityId,
  getPlayerFocusByIdAndOwnerEmail,
  updateTrainingPlayerFocus,
} from "../models/trainingPlayerFocusModel";

export const TrainingPlayerFocusController = {
  async getForActivity(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const playerFocus = await getPlayerFocusByActivityId(
      req.params.activityId,
      req.user.email
    );

    return res.json({
      success: true,
      data: playerFocus,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const playerFocus = await getPlayerFocusByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!playerFocus) {
      return res.status(404).json({
        success: false,
        message: "Player focus not found",
      });
    }

    return res.json({
      success: true,
      data: playerFocus,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const playerFocus = await createTrainingPlayerFocus({
      activityId: req.params.activityId,
      ownerEmail: req.user.email,
      text: req.body.text,
      orderIndex: Number(req.body.orderIndex ?? 1),
    });

    if (!playerFocus) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: playerFocus,
    });
  },

  async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingPlayerFocus = await getPlayerFocusByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!existingPlayerFocus) {
      return res.status(404).json({
        success: false,
        message: "Player focus not found",
      });
    }

    const updatedPlayerFocus = await updateTrainingPlayerFocus({
      id: req.params.id,
      ownerEmail: req.user.email,
      text: req.body.text ?? existingPlayerFocus.text,
      orderIndex: Number(req.body.orderIndex ?? existingPlayerFocus.order_index),
    });

    return res.json({
      success: true,
      data: updatedPlayerFocus,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await deleteTrainingPlayerFocusByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Player focus not found",
      });
    }

    return res.json({
      success: true,
      message: "Player focus deleted",
    });
  },
};