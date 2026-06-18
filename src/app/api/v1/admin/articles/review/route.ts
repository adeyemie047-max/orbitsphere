import { NextRequest, NextResponse } from "next/server";
import { listReviewQueue } from "@/lib/articles-admin";
import { isEditorialSession } from "@/lib/api-auth";
import { parsePagination, requireModerator } from "@/lib/api-admin";
import { canPublishArticle } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const session = await requireModerator();
  if (!isEditorialSession(session)) return session;

  if (!canPublishArticle(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePagination(searchParams);

  try {
    const result = await listReviewQueue({ page, limit });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
