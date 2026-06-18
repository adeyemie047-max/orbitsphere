import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PremiumPlan } from "@prisma/client";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { sendPremiumWelcomeEmail } from "@/lib/email";
import { initializePremiumCheckout } from "@/lib/paystack";
import {
  getPremiumPlan,
  isPaystackConfigured,
  markPremiumPending,
  type PremiumPlanId,
} from "@/lib/premium";

const checkoutSchema = z.object({
  plan: z.enum(["monthly", "annual"]),
});

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
  }

  const planId = parsed.data.plan as PremiumPlanId;
  const plan = getPremiumPlan(planId);

  try {
    const checkout = await initializePremiumCheckout({
      email: session.email,
      plan: planId,
      amountKobo: plan.amountKobo,
      userId: session.userId,
      callbackUrl: `${siteUrl()}/premium/verify`,
    });

    await markPremiumPending({
      userId: session.userId,
      plan: planId as PremiumPlan,
      reference: checkout.reference,
      amountKobo: plan.amountKobo,
    });

    return NextResponse.json({
      authorizationUrl: checkout.authorizationUrl,
      reference: checkout.reference,
    });
  } catch (error) {
    console.error("[premium/checkout]", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 503 }
    );
  }
}
