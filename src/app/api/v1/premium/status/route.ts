import { NextResponse } from "next/server";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { getPremiumSubscription } from "@/lib/premium";

export async function GET() {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  try {
    const subscription = await getPremiumSubscription(session.userId);
    return NextResponse.json({ subscription });
  } catch {
    return NextResponse.json({ error: "Unable to load subscription" }, { status: 503 });
  }
}
