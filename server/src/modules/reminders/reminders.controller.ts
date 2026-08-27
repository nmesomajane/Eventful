import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as remindersService from "./reminders.service";

const updateRemindersSchema = z.object({
  offsetsMinutes: z.array(z.number().int().positive()).max(5),
});

export async function updateMyReminders(req: Request, res: Response, next: NextFunction) {
  try {
    const { offsetsMinutes } = updateRemindersSchema.parse(req.body);
    const created = await remindersService.updateTicketReminders(req.params.id, req.user!.userId, offsetsMinutes);
    res.status(200).json({ reminders: created });
  } catch (err) {
    next(err);
  }
}