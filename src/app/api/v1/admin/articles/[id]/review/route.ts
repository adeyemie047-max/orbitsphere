import { NextRequest, NextResponse } from "next/server";
import { reviewArticleSubmission } from "@/lib/articles-admin";
import { articleReviewSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireModerator } from "@/lib/api-admin";
import { canPublishArticle } from "@/lib/rbac";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireModerator();
  if (!isEditorialSession(session)) return session;

  if (!canPublishArticle(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = articleReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const article = await reviewArticleSubmission(
      id,
      parsed.data.action,
      session.role,
      session.userId
    );
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ data: article });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
