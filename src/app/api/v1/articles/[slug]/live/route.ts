import { NextResponse } from "next/server";
import { getLiveBlogEntries } from "@/lib/live-blog";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const data = await getLiveBlogEntries(slug);
    if (!data) {
      return NextResponse.json({ error: "Live blog not found" }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
