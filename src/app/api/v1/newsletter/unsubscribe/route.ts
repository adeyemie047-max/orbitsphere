import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const unsubscribeSchema = z.object({
  email: z.string().email("Valid email required"),
});

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
    const existing = await db.newsletter.findUnique({ where: { email } });

    if (!existing) {
      return NextResponse.json({
        success: true,
        message: "You have been unsubscribed from OrbitSphere newsletter.",
      });
    }

    await db.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed from OrbitSphere newsletter.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to unsubscribe at this time. Please try again later." },
      { status: 503 }
    );
  }
}
