import { NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  const rate = checkRateLimit(request, "auth:login");
  if (!rate.allowed) {
    return rateLimitResponse(rate.retryAfterSeconds ?? 900);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    return NextResponse.json({ message: "Signed in successfully" });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    throw error;
  }
}
