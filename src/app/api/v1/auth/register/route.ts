import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  const rate = checkRateLimit(request, "auth:register");
  if (!rate.allowed) {
    return rateLimitResponse(rate.retryAfterSeconds ?? 900);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password, fullName, username } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await db.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username }],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email or username already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      fullName,
      username,
      role: UserRole.reader,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      username: true,
      role: true,
    },
  });

  return NextResponse.json(
    {
      data: user,
      message: "Account created. You can now sign in.",
    },
    { status: 201 }
  );
}
