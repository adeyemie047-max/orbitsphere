import type { PremiumPlan } from "@prisma/client";
import { db } from "@/lib/db";

export const PREMIUM_PLANS = {
  monthly: {
    id: "monthly" as const,
    label: "Monthly",
    priceNgn: 2_000,
    amountKobo: 200_000,
    period: "month",
    description: "Flexible — cancel anytime",
  },
  annual: {
    id: "annual" as const,
    label: "Annual",
    priceNgn: 18_000,
    amountKobo: 1_800_000,
    period: "year",
    description: "Save 25% vs monthly",
    badge: "Best value",
  },
} as const;

export type PremiumPlanId = keyof typeof PREMIUM_PLANS;

export function getPremiumPlan(plan: PremiumPlanId) {
  return PREMIUM_PLANS[plan];
}

function addPeriodEnd(from: Date, plan: PremiumPlanId): Date {
  const end = new Date(from);
  if (plan === "monthly") {
    end.setMonth(end.getMonth() + 1);
  } else {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
}

export async function isUserPremium(userId: string): Promise<boolean> {
  const sub = await db.premiumSubscription.findUnique({ where: { userId } });
  if (!sub || sub.status !== "active") return false;

  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) {
    await db.premiumSubscription.update({
      where: { userId },
      data: { status: "expired" },
    });
    return false;
  }

  return true;
}

export async function getPremiumSubscription(userId: string) {
  const sub = await db.premiumSubscription.findUnique({ where: { userId } });
  if (!sub) return null;

  const active = await isUserPremium(userId);
  return {
    plan: sub.plan,
    status: active ? sub.status : ("expired" as const),
    currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
    amountKobo: sub.amountKobo,
  };
}

export async function activatePremium(input: {
  userId: string;
  plan: PremiumPlan;
  reference: string;
  amountKobo: number;
}) {
  const now = new Date();
  const existing = await db.premiumSubscription.findUnique({
    where: { userId: input.userId },
  });

  const baseDate =
    existing?.status === "active" &&
    existing.currentPeriodEnd &&
    existing.currentPeriodEnd > now
      ? existing.currentPeriodEnd
      : now;

  const currentPeriodEnd = addPeriodEnd(baseDate, input.plan as PremiumPlanId);

  return db.premiumSubscription.upsert({
    where: { userId: input.userId },
    create: {
      userId: input.userId,
      plan: input.plan,
      status: "active",
      paystackReference: input.reference,
      amountKobo: input.amountKobo,
      currentPeriodEnd,
    },
    update: {
      plan: input.plan,
      status: "active",
      paystackReference: input.reference,
      amountKobo: input.amountKobo,
      currentPeriodEnd,
    },
  });
}

export async function markPremiumPending(input: {
  userId: string;
  plan: PremiumPlan;
  reference: string;
  amountKobo: number;
}) {
  return db.premiumSubscription.upsert({
    where: { userId: input.userId },
    create: {
      userId: input.userId,
      plan: input.plan,
      status: "pending",
      paystackReference: input.reference,
      amountKobo: input.amountKobo,
    },
    update: {
      plan: input.plan,
      status: "pending",
      paystackReference: input.reference,
      amountKobo: input.amountKobo,
    },
  });
}

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}
