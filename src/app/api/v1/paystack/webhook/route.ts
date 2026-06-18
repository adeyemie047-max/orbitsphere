import { NextRequest, NextResponse } from "next/server";
import { PremiumPlan } from "@prisma/client";
import { db } from "@/lib/db";
import { sendPremiumWelcomeEmail } from "@/lib/email";
import { parsePremiumMetadata, verifyPaystackWebhookSignature } from "@/lib/paystack";
import { activatePremium, getPremiumPlan } from "@/lib/premium";

type PaystackWebhookEvent = {
  event: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata?: Record<string, unknown>;
    paid_at?: string | null;
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const { status, reference, amount, metadata = {} } = event.data;
  if (status !== "success") {
    return NextResponse.json({ received: true });
  }

  const { userId, plan, type } = parsePremiumMetadata(metadata);
  if (type !== "premium_subscription" || !userId || !plan) {
    return NextResponse.json({ received: true });
  }

  const expected = getPremiumPlan(plan).amountKobo;
  if (amount !== expected) {
    console.warn("[paystack/webhook] amount mismatch", { reference, amount, expected });
    return NextResponse.json({ received: true });
  }

  try {
    const subscription = await activatePremium({
      userId,
      plan: plan as PremiumPlan,
      reference,
      amountKobo: amount,
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    });

    if (user?.email && subscription.currentPeriodEnd) {
      void sendPremiumWelcomeEmail({
        to: user.email,
        name: user.fullName,
        plan,
        expiresAt: subscription.currentPeriodEnd,
      });
    }
  } catch (error) {
    console.error("[paystack/webhook]", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
