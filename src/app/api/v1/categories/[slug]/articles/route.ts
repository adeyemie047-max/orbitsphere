import { NextResponse } from "next/server";
import { getArticlesByCategory } from "@/lib/data";
import { getPublicArticles } from "@/lib/articles-db";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  try {
    const data = await getPublicArticles({ categorySlug: slug, limit });
    return NextResponse.json({ data, total: data.length, source: "database" });
  } catch {
    const data = getArticlesByCategory(
      slug as Parameters<typeof getArticlesByCategory>[0]
    )
      .filter((article) => article.status === "published")
      .slice(0, limit);

    return NextResponse.json({ data, total: data.length, source: "mock" });
  }
}
