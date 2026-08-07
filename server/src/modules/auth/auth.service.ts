import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { users } from "../../db/schema";
import { hashPassword, verifyPassword } from "../../utils/password";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";
import type { SignupInput, LoginInput } from "./auth.validators";

export async function signup(input: SignupInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });
  if (existing) throw new AppError(409, "Email already in use");

  const passwordHash = await hashPassword(input.password);

  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    })
    .returning();

  const tokens = issueTokens(user.id, user.role);
  return { user: sanitize(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });
  if (!user) throw new AppError(401, "Invalid credentials");

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const tokens = issueTokens(user.id, user.role);
  return { user: sanitize(user), ...tokens };
}

function issueTokens(userId: string, role: "organizer" | "attendee") {
  return {
    accessToken: signAccessToken({ userId, role }),
    refreshToken: signRefreshToken({ userId, role }),
  };
}

function sanitize(user: typeof users.$inferSelect) {
  const { passwordHash, ...rest } = user;
  return rest;
}