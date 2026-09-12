import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingPitch,
  deleteTrainingPitchByIdAndOwnerEmail,
  getPitchByIdAndOwnerEmail,
  getPitchesByTrainingStoryId,
  updateTrainingPitch,
} from "../models/trainingPitchModel";

export const TrainingPitchController = {
  async getForTrainingStory(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const pitches = await getPitchesByTrainingStoryId(
      req.params.storyId,
      req.user.email
    );

    return res.json({
      success: true,
      data: pitches,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const pitch = await getPitchByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: "Pitch not found",
      });
    }

    return res.json({
      success: true,
      data: pitch,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const pitch = await createTrainingPitch({
      trainingStoryId: req.params.storyId,
      ownerEmail: req.user.email,
      name: req.body.name,
      coachName: req.body.coachName,
      playerGroup: req.body.playerGroup,
      orderIndex: Number(req.body.orderIndex ?? 1),
    });

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: "Training story not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: pitch,
    });
  },

  async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingPitch = await getPitchByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!existingPitch) {
      return res.status(404).json({
        success: false,
        message: "Pitch not found",
      });
    }

    const updatedPitch = await updateTrainingPitch({
      id: req.params.id,
      ownerEmail: req.user.email,
      name: req.body.name ?? existingPitch.name,
      coachName: req.body.coachName ?? existingPitch.coach_name,
      playerGroup: req.body.playerGroup ?? existingPitch.player_group,
      orderIndex: Number(req.body.orderIndex ?? existingPitch.order_index),
    });

    return res.json({
      success: true,
      data: updatedPitch,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await deleteTrainingPitchByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Pitch not found",
      });
    }

    return res.json({
      success: true,
      message: "Pitch deleted",
    });
  },
};