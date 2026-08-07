import { Request, Response, NextFunction } from "express";
import { signupSchema, loginSchema } from "./auth.validators";
import * as authService from "./auth.service";
import { env } from "../../config/env";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const input = signupSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.signup(input);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.login(input);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("refreshToken", cookieOptions);
  res.status(204).send();
}