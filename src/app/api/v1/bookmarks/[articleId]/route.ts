import { NextResponse } from "next/server";
import { removeBookmark } from "@/lib/bookmarks";
import { isUserSession, requireUserSession } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ articleId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const { articleId } = await context.params;

  try {
    await removeBookmark(session.userId, articleId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
