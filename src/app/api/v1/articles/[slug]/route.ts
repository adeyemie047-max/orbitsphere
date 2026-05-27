import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/data";
import { getPublicArticleBySlug } from "@/lib/articles-db";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const article = await getPublicArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ data: article, source: "database" });
  } catch {
    const article = getArticleBySlug(slug);
    if (!article || article.status !== "published") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ data: article, source: "mock" });
  }
}
