import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { removePushSubscription, savePushSubscription } from "@/lib/push";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { parseJsonBody } from "@/lib/api-admin";

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    await savePushSubscription(session.userId, parsed.data);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const body = await parseJsonBody<{ endpoint?: string }>(request);
  if (body instanceof NextResponse) return body;

  if (!body.endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }

  try {
    await removePushSubscription(session.userId, body.endpoint);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
