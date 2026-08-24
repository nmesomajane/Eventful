import { Request, Response, NextFunction } from "express";
import { purchaseTicketSchema, verifyPaymentSchema } from "./tickets.validators";
import * as ticketsService from "./tickets.service";

export async function purchase(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = purchaseTicketSchema.parse(req.body);
    const result = await ticketsService.initializePurchase(req.user!.userId, eventId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const { reference } = verifyPaymentSchema.parse(req.params);
    const ticket = await ticketsService.verifyPayment(reference);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function getQrCode(req: Request, res: Response, next: NextFunction) {
  try {
    const dataUrl = await ticketsService.getQrCodeImage(req.params.id, req.user!.userId);
    res.status(200).json({ qrCodeImage: dataUrl });
  } catch (err) {
    next(err);
  }
}

export async function mine(req: Request, res: Response, next: NextFunction) {
  try {
    const tickets = await ticketsService.getMyTickets(req.user!.userId);
    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
}

export async function scan(req: Request, res: Response, next: NextFunction) {
  try {
    const { qrCode } = req.body;
    const ticket = await ticketsService.scanTicket(qrCode, req.user!.userId);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
}