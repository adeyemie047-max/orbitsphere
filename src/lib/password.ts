import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function createResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function resetTokenExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000);
}
