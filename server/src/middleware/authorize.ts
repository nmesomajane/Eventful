import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function authorize(...roles: Array<"organizer" | "attendee">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "Insufficient permissions"));
    }
    next();
  };
}