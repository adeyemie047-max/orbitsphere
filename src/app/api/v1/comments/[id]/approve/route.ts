import { NextResponse } from "next/server";
import {
  approveComment,
  getCommentById,
} from "@/lib/admin-comments";
import { isEditorialSession } from "@/lib/api-auth";
import { requireModerator } from "@/lib/api-admin";
import { revalidateTag } from "next/cache";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(_request: Request, context: RouteContext) {
  const session = await requireModerator();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  try {
    const existing = await getCommentById(id);
    if (!existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const comment = await approveComment(id);
    revalidateTag(`article-${comment.article.slug}`);

    return NextResponse.json({
      data: {
        id: comment.id,
        isApproved: comment.isApproved,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
