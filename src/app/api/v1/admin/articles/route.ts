import { NextRequest, NextResponse } from "next/server";
import { ArticleStatus } from "@prisma/client";
import { getDashboardArticles } from "@/lib/dashboard-data";
import { articleBodySchema } from "@/lib/article-schema";
import { createArticle } from "@/lib/articles-admin";
import { canPublishArticle, canWriteArticles } from "@/lib/rbac";
import { isEditorialSession, requireEditorialSession } from "@/lib/api-auth";

export async function GET() {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  const { articles, source } = await getDashboardArticles(
    session.role,
    session.userId
  );

  return NextResponse.json({ data: articles, total: articles.length, source });
}

export async function POST(request: NextRequest) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  if (!canWriteArticles(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = articleBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const status = parsed.data.status ?? "draft";

  if (
    (status === "published" || status === "scheduled") &&
    !canPublishArticle(session.role)
  ) {
    return NextResponse.json(
      { error: "Only editors and admins can publish or schedule" },
      { status: 403 }
    );
  }

  if (status === "scheduled" && !parsed.data.scheduledAt) {
    return NextResponse.json(
      { error: "scheduledAt is required for scheduled articles" },
      { status: 400 }
    );
  }

  try {
    const article = await createArticle(
      {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        body: parsed.data.body,
        featuredImage: parsed.data.featuredImage,
        categoryId: parsed.data.categoryId,
        status: status as ArticleStatus,
        scheduledAt: parsed.data.scheduledAt
          ? new Date(parsed.data.scheduledAt)
          : null,
        isBreaking: parsed.data.isBreaking,
        isFeatured: parsed.data.isFeatured,
        isInvestigative: parsed.data.isInvestigative,
        submittedForReview: parsed.data.submittedForReview,
      },
      session.userId
    );

    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    console.error("Create article failed:", error);
    return NextResponse.json(
      { error: "Database unavailable. Start Postgres and run npm run db:setup." },
      { status: 503 }
    );
  }
}
