import type { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { AppError, sendError } from "../utils/errors";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found" });
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, err instanceof AppError ? err : err);
};
