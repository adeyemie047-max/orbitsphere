import { NextRequest, NextResponse } from "next/server";
import { PremiumPlan } from "@prisma/client";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { sendPremiumWelcomeEmail } from "@/lib/email";
import { parsePremiumMetadata, verifyTransaction } from "@/lib/paystack";
import { activatePremium, getPremiumPlan, isPaystackConfigured, type PremiumPlanId } from "@/lib/premium";

export async function GET(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
  }

  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  try {
    const tx = await verifyTransaction(reference);

    if (tx.status !== "success") {
      return NextResponse.json(
        { error: "Payment was not completed", status: tx.status },
        { status: 402 }
      );
    }

    const { userId, plan, type } = parsePremiumMetadata(tx.metadata);

    if (type !== "premium_subscription" || !userId || !plan) {
      return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
    }

    if (userId !== session.userId) {
      return NextResponse.json({ error: "Payment does not match your account" }, { status: 403 });
    }

    const expected = getPremiumPlan(plan).amountKobo;
    if (tx.amountKobo !== expected) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    const subscription = await activatePremium({
      userId,
      plan: plan as PremiumPlan,
      reference: tx.reference,
      amountKobo: tx.amountKobo,
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

    return NextResponse.json({
      success: true,
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("[premium/verify]", error);
    return NextResponse.json({ error: "Unable to verify payment" }, { status: 503 });
  }
}
