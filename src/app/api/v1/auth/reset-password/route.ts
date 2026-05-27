import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  const rate = checkRateLimit(request, "auth:reset-password");
  if (!rate.allowed) {
    return rateLimitResponse(rate.retryAfterSeconds ?? 900);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    db.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  return NextResponse.json({ message: "Password updated successfully" });
}
