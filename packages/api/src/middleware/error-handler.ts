import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";

export interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error to Sentry
  Sentry.captureException(err);

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Development vs Production error details
  const errorResponse = {
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      errors: err.errors,
    }),
  };

  console.error("[Error Handler]:", {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(statusCode).json(errorResponse);
};

export class AppError extends Error implements ApiError {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: any[]
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
