import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  role: "organizer" | "attendee";
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET as Secret,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"] }
  );

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET as Secret,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] }
  );

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;