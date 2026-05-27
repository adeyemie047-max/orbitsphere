import { NextRequest, NextResponse } from "next/server";
import { listNotifications, markNotificationRead } from "@/lib/push";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { parseJsonBody } from "@/lib/api-admin";

export async function GET() {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  try {
    const notifications = await listNotifications(session.userId);
    return NextResponse.json({
      data: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        message: n.message,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const body = await parseJsonBody<{ id?: string }>(request);
  if (body instanceof NextResponse) return body;

  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    await markNotificationRead(session.userId, body.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
