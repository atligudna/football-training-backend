import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingCoachingPoint,
  deleteTrainingCoachingPointByIdAndOwnerEmail,
  getCoachingPointByIdAndOwnerEmail,
  getCoachingPointsByActivityId,
  updateTrainingCoachingPoint,
} from "../models/trainingCoachingPointModel";

export const TrainingCoachingPointController = {
  async getForActivity(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const coachingPoints = await getCoachingPointsByActivityId(
      req.params.activityId,
      req.user.email
    );

    return res.json({
      success: true,
      data: coachingPoints,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const coachingPoint = await getCoachingPointByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!coachingPoint) {
      return res.status(404).json({
        success: false,
        message: "Coaching point not found",
      });
    }

    return res.json({
      success: true,
      data: coachingPoint,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const coachingPoint = await createTrainingCoachingPoint({
      activityId: req.params.activityId,
      ownerEmail: req.user.email,
      text: req.body.text,
      orderIndex: Number(req.body.orderIndex ?? 1),
    });

    if (!coachingPoint) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: coachingPoint,
    });
  },

  async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingCoachingPoint = await getCoachingPointByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!existingCoachingPoint) {
      return res.status(404).json({
        success: false,
        message: "Coaching point not found",
      });
    }

    const updatedCoachingPoint = await updateTrainingCoachingPoint({
      id: req.params.id,
      ownerEmail: req.user.email,
      text: req.body.text ?? existingCoachingPoint.text,
      orderIndex: Number(
        req.body.orderIndex ?? existingCoachingPoint.order_index
      ),
    });

    return res.json({
      success: true,
      data: updatedCoachingPoint,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await deleteTrainingCoachingPointByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Coaching point not found",
      });
    }

    return res.json({
      success: true,
      message: "Coaching point deleted",
    });
  },
};