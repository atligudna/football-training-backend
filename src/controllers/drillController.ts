import { NextFunction, Request, Response } from "express";
import { DrillModel } from "../models/drillModel";
import { successResponse } from "../middleware/success";

export const DrillController = {
  async getAll(req: Request, res: Response, next: NextFunction){
    try {
      const drills = await DrillModel.getAll();
      
      return successResponse(res, drills);
    } catch (error) {
      next(error);
    }
    
  },
  async getById(req: Request, res: Response, next:NextFunction) {
    try {
      const id = Number(req.params.id);
      const drill = await DrillModel.getById(id);

      if(!drill) {
        throw { 
          status: 404, 
          message: "Drill not found" 
        };
      }
      
      return successResponse(res, drill);

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
    
    return successResponse(res, drill, 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next:NextFunction) {
    try {
      const id = Number(req.params.id);
      const updated = await DrillModel.update(id, req.body);
      
      if (!updated) {
        throw { 
          status: 404, 
          message: "Drill not found" 
        };
      }
      
      return successResponse(res, updated); 
    } catch (error) {
      next(error);
    }
  },

  async remove (req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const drill = await DrillModel.getById(id);

      if (!drill) {
        throw { 
          status: 404, 
          message: "Drill not found" 
        };
      }

      await DrillModel.remove(id);

      return successResponse(res, {
        message: "Drill deleted"
      });

    } catch (error) {
      next(error); 
    } 
  }
};
