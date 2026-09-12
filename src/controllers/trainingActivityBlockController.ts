import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingActivityBlock,
  deleteTrainingActivityBlockByIdAndOwnerEmail,
  getActivityBlockByIdAndOwnerEmail,
  getActivityBlocksByPitchId,
  updateTrainingActivityBlock,
} from "../models/trainingActivityBlockModel";

export const TrainingActivityBlockController = {
  async getForPitch(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const blocks = await getActivityBlocksByPitchId(
      req.params.pitchId,
      req.user.email
    );

    return res.json({
      success: true,
      data: blocks,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const block = await getActivityBlockByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Activity block not found",
      });
    }

    return res.json({
      success: true,
      data: block,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const block = await createTrainingActivityBlock({
      pitchId: req.params.pitchId,
      ownerEmail: req.user.email,
      title: req.body.title,
      type: req.body.type,
      orderIndex: Number(req.body.orderIndex ?? 1),
      durationMinutes: Number(req.body.durationMinutes),
    });

    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Pitch not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: block,
    });
  },

  async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingBlock = await getActivityBlockByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!existingBlock) {
      return res.status(404).json({
        success: false,
        message: "Activity block not found",
      });
    }

    const updatedBlock = await updateTrainingActivityBlock({
      id: req.params.id,
      ownerEmail: req.user.email,
      title: req.body.title ?? existingBlock.title,
      type: req.body.type ?? existingBlock.type,
      orderIndex: Number(req.body.orderIndex ?? existingBlock.order_index),
      durationMinutes: Number(
        req.body.durationMinutes ?? existingBlock.duration_minutes
      ),
    });

    return res.json({
      success: true,
      data: updatedBlock,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await deleteTrainingActivityBlockByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Activity block not found",
      });
    }

    return res.json({
      success: true,
      message: "Activity block deleted",
    });
  },
};