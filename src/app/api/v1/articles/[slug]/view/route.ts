import { NextResponse } from "next/server";
import { incrementArticleViews } from "@/lib/articles-db";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const viewsCount = await incrementArticleViews(slug);
    if (viewsCount === null) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ viewsCount });
  } catch {
    return NextResponse.json({ message: "View recorded" });
  }
}
