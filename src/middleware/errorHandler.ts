import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by middleware:", error);


  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.flatten(),
    });
  }

  if (error.code) {
    return res.status(400).json({
      success: false,
      error: "Database error",
      code: error.code,
      detail: error.detail,
    });
  }

  const status = error.status || 500;

  return res.status(status).json({
    success: false,
    error: error.message || "Internal server error",
  });
};
