import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const unsubscribeSchema = z.object({
  email: z.string().email("Valid email required"),
});

async function unsubscribeEmail(email: string) {
  const existing = await db.newsletter.findUnique({ where: { email } });

  if (!existing) {
    return {
      success: true,
      message: "You have been unsubscribed from OrbitSphere newsletter.",
    };
  }

  await db.newsletter.update({
    where: { email },
    data: { isActive: false },
  });

  return {
    success: true,
    message: "You have been unsubscribed from OrbitSphere newsletter.",
  };
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.toLowerCase();
  if (!email) {
    return NextResponse.redirect(
      new URL("/newsletter/unsubscribe", request.nextUrl.origin)
    );
  }

  const parsed = unsubscribeSchema.safeParse({ email });
  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/newsletter/unsubscribe?error=invalid", request.nextUrl.origin)
    );
  }

  try {
    await unsubscribeEmail(parsed.data.email);
    return NextResponse.redirect(
      new URL("/newsletter/unsubscribe?success=1", request.nextUrl.origin)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/newsletter/unsubscribe?error=failed", request.nextUrl.origin)
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = unsubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Valid email required" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const result = await unsubscribeEmail(email);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unable to unsubscribe at this time. Please try again later." },
      { status: 503 }
    );
  }
}
