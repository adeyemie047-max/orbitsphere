import crypto from "crypto";
import type { PremiumPlanId } from "@/lib/premium";

const PAYSTACK_BASE = "https://api.paystack.co";

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type InitializeTransactionResult = {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
};

export type VerifyTransactionResult = {
  status: "success" | "failed" | "pending" | "abandoned";
  reference: string;
  amountKobo: number;
  currency: string;
  metadata: Record<string, unknown>;
  paidAt: string | null;
};

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

async function paystackFetch<T>(
  path: string,
  init?: RequestInit
): Promise<PaystackResponse<T>> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const json = (await res.json()) as PaystackResponse<T>;
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Paystack request failed");
  }
  return json;
}

export async function initializePremiumCheckout(input: {
  email: string;
  plan: PremiumPlanId;
  amountKobo: number;
  userId: string;
  callbackUrl: string;
}): Promise<InitializeTransactionResult> {
  const json = await paystackFetch<{
    authorization_url: string;
    reference: string;
    access_code: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: "NGN",
      callback_url: input.callbackUrl,
      metadata: {
        userId: input.userId,
        plan: input.plan,
        type: "premium_subscription",
      },
    }),
  });

  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference,
    accessCode: json.data.access_code,
  };
}

export async function verifyTransaction(
  reference: string
): Promise<VerifyTransactionResult> {
  const json = await paystackFetch<{
    status: string;
    reference: string;
    amount: number;
    currency: string;
    metadata: Record<string, unknown>;
    paid_at: string | null;
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);

  return {
    status: json.data.status as VerifyTransactionResult["status"],
    reference: json.data.reference,
    amountKobo: json.data.amount,
    currency: json.data.currency,
    metadata: json.data.metadata ?? {},
    paidAt: json.data.paid_at,
  };
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) return false;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export function parsePremiumMetadata(metadata: Record<string, unknown>): {
  userId: string | null;
  plan: PremiumPlanId | null;
  type: string | null;
} {
  const userId = typeof metadata.userId === "string" ? metadata.userId : null;
  const plan: PremiumPlanId | null =
    metadata.plan === "monthly" || metadata.plan === "annual" ? metadata.plan : null;
  const type = typeof metadata.type === "string" ? metadata.type : null;

  return { userId, plan, type };
}
