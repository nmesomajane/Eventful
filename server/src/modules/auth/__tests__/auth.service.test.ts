import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "../auth.service";
import { db } from "../../../config/db";
import { AppError } from "../../../utils/AppError";

vi.mock("../../../config/db", () => ({
  db: {
    query: { users: { findFirst: vi.fn() } },
    insert: vi.fn(),
  },
}));

vi.mock("../../../utils/password.js", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed_password"),
  verifyPassword: vi.fn(),
}));

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signup", () => {
    it("throws 409 if email already exists", async () => {
      (db.query.users.findFirst as any).mockResolvedValue({ id: "existing-user", email: "jane@example.com" });

      await expect(
        authService.signup({ name: "Jane", email: "jane@example.com", password: "password123", role: "attendee" })
      ).rejects.toThrow(AppError);

      await expect(
        authService.signup({ name: "Jane", email: "jane@example.com", password: "password123", role: "attendee" })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("creates a user when email is free", async () => {
      (db.query.users.findFirst as any).mockResolvedValue(undefined);
      const mockUser = {
        id: "new-user-id",
        name: "Jane",
        email: "jane@example.com",
        role: "attendee",
        passwordHash: "hashed_password",
      };
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await authService.signup({
        name: "Jane",
        email: "jane@example.com",
        password: "password123",
        role: "attendee",
      });

      expect(result.user.email).toBe("jane@example.com");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect((result.user as any).passwordHash).toBeUndefined(); // sanitize() must strip this
    });
  });

  describe("login", () => {
    it("throws 401 if user does not exist", async () => {
      (db.query.users.findFirst as any).mockResolvedValue(undefined);

      await expect(
        authService.login({ email: "ghost@example.com", password: "whatever" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("throws 401 if password is wrong", async () => {
      const { verifyPassword } = await import("../../../utils/password.js");
      (db.query.users.findFirst as any).mockResolvedValue({
        id: "user-id",
        email: "jane@example.com",
        passwordHash: "hashed_password",
        role: "attendee",
      });
      (verifyPassword as any).mockResolvedValue(false);

      await expect(
        authService.login({ email: "jane@example.com", password: "wrongpass" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});