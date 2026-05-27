import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createResetToken, resetTokenExpiry } from "@/lib/password";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  const rate = checkRateLimit(request, "auth:forgot-password");
  if (!rate.allowed) {
    return rateLimitResponse(rate.retryAfterSeconds ?? 900);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });

  // Always return success to avoid email enumeration.
  const response = {
    message:
      "If an account exists for that email, a password reset link has been sent.",
  };

  if (!user?.passwordHash) {
    return NextResponse.json(response);
  }

  await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = createResetToken();
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires: resetTokenExpiry(),
    },
  });

  const resetUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({
      ...response,
      devResetUrl: resetUrl,
    });
  }

  // Production: integrate email provider (Resend, SendGrid, etc.)
  console.info("[forgot-password] reset link generated for", email);

  return NextResponse.json(response);
}
