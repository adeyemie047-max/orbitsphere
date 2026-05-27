import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getArticleComments } from "@/lib/articles-db";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ArticleStatus } from "@prisma/client";

type RouteContext = { params: Promise<{ slug: string }> };

const commentSchema = z.object({
  body: z.string().min(3, "Comment is too short").max(2000),
  parentId: z.string().uuid().optional(),
});

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  const article = await db.article.findFirst({
    where: { slug, status: ArticleStatus.published },
    select: { id: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  try {
    const data = await getArticleComments(article.id);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const limited = enforceRateLimit(request, "comments:post", 20);
  if (limited) return limited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { slug } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const article = await db.article.findFirst({
    where: { slug, status: ArticleStatus.published },
    select: { id: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  await db.comment.create({
    data: {
      articleId: article.id,
      userId: session.user.id,
      parentId: parsed.data.parentId ?? null,
      body: parsed.data.body,
      isApproved: false,
    },
  });

  return NextResponse.json(
    {
      message:
        "Comment submitted and awaiting moderation before it appears publicly.",
    },
    { status: 201 }
  );
}
