import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { createResetToken, hashPassword, resetTokenExpiry } from "@/lib/password";
import { sendStaffInviteEmail } from "@/lib/email";

export async function inviteStaffUser(input: {
  email: string;
  fullName: string;
  username: string;
  role: UserRole;
}) {
  const normalizedEmail = input.email.toLowerCase();
  const username = input.username.toLowerCase();

  const existing = await db.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username }],
    },
  });

  if (existing) {
    throw new Error("A user with this email or username already exists");
  }

  const tempPassword = createResetToken().slice(0, 16);
  const passwordHash = await hashPassword(tempPassword);
  const token = createResetToken();

  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      fullName: input.fullName,
      username,
      role: input.role,
      passwordHash,
      isVerified: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      username: true,
      role: true,
    },
  });

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires: resetTokenExpiry(),
    },
  });

  const resetUrl = `${process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

  const emailResult = await sendStaffInviteEmail({
    to: normalizedEmail,
    name: input.fullName,
    role: input.role,
    resetUrl,
  });

  return {
    user,
    emailSent: emailResult.ok,
    devResetUrl:
      process.env.NODE_ENV === "development" && !emailResult.ok ? resetUrl : undefined,
  };
}
