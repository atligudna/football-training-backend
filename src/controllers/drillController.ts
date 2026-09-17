import { NextFunction, Request, Response } from "express";
import { DrillModel } from "../models/drillModel";
import { successResponse } from "../middleware/success";

function getUserId(req: Request) {
  return req.user?.id;
}

export const DrillController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const drills = await DrillModel.getAll(userId);

      return successResponse(res, drills);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
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
          message: "Invalid drill id",
        };
      }

      const drill = await DrillModel.getById(id, userId);

      if (!drill) {
        throw {
          status: 404,
          message: "Drill not found",
        };
      }

      return successResponse(res, drill);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const drill = await DrillModel.create({
        ...req.body,
        createdBy: userId,
      });

      return successResponse(res, drill, 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
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
          message: "Invalid drill id",
        };
      }

      const updated = await DrillModel.update(id, userId, req.body);

      if (!updated) {
        throw {
          status: 404,
          message: "Drill not found",
        };
      }

      return successResponse(res, updated);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
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
          message: "Invalid drill id",
        };
      }

      const wasDeleted = await DrillModel.remove(id, userId);

      if (!wasDeleted) {
        throw {
          status: 404,
          message: "Drill not found",
        };
      }

      return successResponse(res, null);
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const drills = await DrillModel.getDeleted(userId);

      return successResponse(res, drills);
    } catch (error) {
      next(error);
    }
  },

  async restore(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

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
          message: "Invalid drill id",
        };
      }

      const restoredDrill = await DrillModel.restore(id, userId);

      if (!restoredDrill) {
        throw {
          status: 404,
          message: "Deleted drill not found",
        };
      }

      return successResponse(res, restoredDrill);
    } catch (error) {
      next(error);
    }
  },
};