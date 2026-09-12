import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
  createTrainingEquipmentItem,
  deleteTrainingEquipmentItemByIdAndOwnerEmail,
  getEquipmentItemByIdAndOwnerEmail,
  getEquipmentItemsByActivityId,
  updateTrainingEquipmentItem,
} from "../models/trainingEquipmentItemModel";

export const TrainingEquipmentItemController = {
  async getForActivity(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const equipmentItems = await getEquipmentItemsByActivityId(
      req.params.activityId,
      req.user.email
    );

    return res.json({
      success: true,
      data: equipmentItems,
    });
  },

  async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const equipmentItem = await getEquipmentItemByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!equipmentItem) {
      return res.status(404).json({
        success: false,
        message: "Equipment item not found",
      });
    }

    return res.json({
      success: true,
      data: equipmentItem,
    });
  },

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const equipmentItem = await createTrainingEquipmentItem({
      activityId: req.params.activityId,
      ownerEmail: req.user.email,
      name: req.body.name,
      quantity: Number(req.body.quantity ?? 1),
      orderIndex: Number(req.body.orderIndex ?? 1),
    });

    if (!equipmentItem) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: equipmentItem,
    });
  },

  async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const existingEquipmentItem = await getEquipmentItemByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!existingEquipmentItem) {
      return res.status(404).json({
        success: false,
        message: "Equipment item not found",
      });
    }

    const updatedEquipmentItem = await updateTrainingEquipmentItem({
      id: req.params.id,
      ownerEmail: req.user.email,
      name: req.body.name ?? existingEquipmentItem.name,
      quantity: Number(req.body.quantity ?? existingEquipmentItem.quantity),
      orderIndex: Number(req.body.orderIndex ?? existingEquipmentItem.order_index),
    });

    return res.json({
      success: true,
      data: updatedEquipmentItem,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await deleteTrainingEquipmentItemByIdAndOwnerEmail(
      req.params.id,
      req.user.email
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Equipment item not found",
      });
    }

    return res.json({
      success: true,
      message: "Equipment item deleted",
    });
  },
};