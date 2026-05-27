import { NextRequest, NextResponse } from "next/server";
import { ArticleStatus } from "@prisma/client";
import { db } from "@/lib/db";
import {
  canDeleteArticle,
  canEditArticle,
  canPublishArticle,
} from "@/lib/rbac";
import { isEditorialSession, requireEditorialSession } from "@/lib/api-auth";
import { articleUpdateSchema } from "@/lib/article-schema";
import {
  getArticleForEditor,
  updateArticle,
} from "@/lib/articles-admin";
import { revalidateArticlePages } from "@/lib/revalidate-articles";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  const article = await getArticleForEditor(id, session.role, session.userId);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ data: article });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = articleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (
    (parsed.data.status === "published" || parsed.data.status === "scheduled") &&
    !canPublishArticle(session.role)
  ) {
    return NextResponse.json(
      { error: "Only editors and admins can publish or schedule" },
      { status: 403 }
    );
  }

  if (parsed.data.status === "scheduled" && !parsed.data.scheduledAt) {
    try {
      const existing = await db.article.findUnique({ where: { id } });
      if (!existing?.scheduledAt) {
        return NextResponse.json(
          { error: "scheduledAt is required for scheduled articles" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }
  }

  try {
    const article = await updateArticle(
      id,
      {
        ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
        ...(parsed.data.slug !== undefined ? { slug: parsed.data.slug } : {}),
        ...(parsed.data.excerpt !== undefined
          ? { excerpt: parsed.data.excerpt }
          : {}),
        ...(parsed.data.body !== undefined ? { body: parsed.data.body } : {}),
        ...(parsed.data.featuredImage !== undefined
          ? { featuredImage: parsed.data.featuredImage }
          : {}),
        ...(parsed.data.categoryId !== undefined
          ? { categoryId: parsed.data.categoryId }
          : {}),
        ...(parsed.data.status !== undefined
          ? { status: parsed.data.status as ArticleStatus }
          : {}),
        ...(parsed.data.scheduledAt !== undefined
          ? {
              scheduledAt: parsed.data.scheduledAt
                ? new Date(parsed.data.scheduledAt)
                : null,
            }
          : {}),
        ...(parsed.data.isBreaking !== undefined
          ? { isBreaking: parsed.data.isBreaking }
          : {}),
        ...(parsed.data.isFeatured !== undefined
          ? { isFeatured: parsed.data.isFeatured }
          : {}),
        ...(parsed.data.isInvestigative !== undefined
          ? { isInvestigative: parsed.data.isInvestigative }
          : {}),
      },
      session.role,
      session.userId
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ data: article });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  try {
    const article = await db.article.findUnique({
      where: { id },
      include: { category: { select: { slug: true } } },
    });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!canDeleteArticle(session.role, session.userId, article.authorId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.article.delete({ where: { id } });

    if (article.status === ArticleStatus.published) {
      await revalidateArticlePages(article.slug, article.category.slug);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
