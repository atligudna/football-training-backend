import { Request, Response } from "express";

export const DrillController = {
  getAll: (req: Request, res: Response) => {
    res.json({
      success: true,
      data: []
    });
  },

  create: (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Drill created"
    });
  },

  remove: (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Drill removed"
    });
  }
};
