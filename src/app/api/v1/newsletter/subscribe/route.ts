import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendNewsletterWelcomeEmail } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  email: z.string().email("Valid email required"),
});

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, "newsletter:subscribe", 10);
  if (limited) return limited;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Valid email required" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await db.newsletter.upsert({
      where: { email },
      create: { email, isActive: true },
      update: { isActive: true },
    });

    void sendNewsletterWelcomeEmail({ to: email });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to OrbitSphere newsletter.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to subscribe at this time. Please try again later." },
      { status: 503 }
    );
  }
}
