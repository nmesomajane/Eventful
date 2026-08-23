import { Request, Response, NextFunction } from "express";
import { createEventSchema, updateEventSchema, listEventsQuerySchema } from "./events.validators";
import * as eventsService from "./events.service";
import { AppError } from "../../utils/AppError";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createEventSchema.parse(req.body);
    const event = await eventsService.createEvent(req.user!.userId, input);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listEventsQuerySchema.parse(req.query);
    const events = await eventsService.getPublishedEvents(query);
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventsService.getEventById(req.params.id);
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

export async function mine(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventsService.getMyEvents(req.user!.userId);
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateEventSchema.parse(req.body);
    const event = await eventsService.updateEvent(req.params.id, req.user!.userId, input);
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await eventsService.deleteEvent(req.params.id, req.user!.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}