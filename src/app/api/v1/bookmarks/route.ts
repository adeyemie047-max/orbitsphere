import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listBookmarks, addBookmark } from "@/lib/bookmarks";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { parseJsonBody } from "@/lib/api-admin";

const createSchema = z.object({
  articleId: z.string().uuid(),
});

export async function GET() {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  try {
    const data = await listBookmarks(session.userId);
    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    const bookmark = await addBookmark(session.userId, parsed.data.articleId);
    if (!bookmark) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ data: bookmark }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
