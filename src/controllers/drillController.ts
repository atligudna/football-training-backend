import { NextFunction, Request, Response } from "express";
import { DrillModel } from "../models/drillModel";

export const DrillController = {
  async getAll(req: Request, res: Response, next: NextFunction){
    try {
      const drills = await DrillModel.getAll();
      
      res.json({
        success: true,
        data: drills
    });
    } catch (error) {
      next(error);
    }
    
  },
  async getById(req: Request, res: Response, next:NextFunction) {
    try {
      const id = Number(req.params.id);
      const drill = await DrillModel.getById(id);

      if(!drill) {
        return res.status(404).json({
          success: false,
          message: "Drill not found"
        });
      }
      res.json({
        success: true,
        data: drill
      });
    } catch (error) {
      next(error);
    }
  },
  
  async create (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
    if(!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }
    const drill = await DrillModel.create({
      ...req.body,
      created_by: userId
    });
    
    res.json({
      success: true,
      data: drill
    });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next:NextFunction) {
    try {
      const id = Number(req.params.id);
      const updated = await DrillModel.update(id, req.body);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Drill not found"
        });
      }
      
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async remove (req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const drill = await DrillModel.getById(id);

      if (!drill) {
        return res.status(404).json({
          success:false,
          message: "Drill not found"
        });
      }

      await DrillModel.remove(id);

      res.json({
        success: true,
        message: "Drill deleted"
      });
      
    } catch (error) {
      next(error); 
    } 
  }
};
