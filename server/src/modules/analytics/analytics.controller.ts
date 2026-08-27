import { Request, Response, NextFunction } from "express";
import * as analyticsService from "./analytics.service";

export async function overview(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await analyticsService.getOverview(req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function eventsBreakdown(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await analyticsService.getEventsBreakdown(req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function eventDetail(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await analyticsService.getEventAnalytics(req.params.id, req.user!.userId));
  } catch (err) {
    next(err);
  }
}