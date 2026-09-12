import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingStory,
  getTrainingStoriesByOwnerEmail,
  getTrainingStoryByIdAndOwnerEmail,
} from "../models/trainingStoryModel";

export const TrainingStoryController = {
  async getAll(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const stories = await getTrainingStoriesByOwnerEmail(req.user.email);

    return res.json({
      success: true,
      data: stories,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const story = await getTrainingStoryByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Training story not found",
      });
    }

    return res.json({
      success: true,
      data: story,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const story = await createTrainingStory({
      ownerEmail: req.user.email,
      title: req.body.title,
      description: req.body.description ?? "",
      ageGroup: req.body.ageGroup,
      durationMinutes: Number(req.body.durationMinutes),
      theme: req.body.theme,
      tags: req.body.tags ?? [],
      objectives: req.body.objectives ?? [],
      status: req.body.status ?? "draft",
    });

    return res.status(201).json({
      success: true,
      data: story,
    });
  },
};
