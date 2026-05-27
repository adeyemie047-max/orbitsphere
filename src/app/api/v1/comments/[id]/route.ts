import { NextResponse } from "next/server";
import { deleteComment } from "@/lib/admin-comments";
import { auth } from "@/auth";
import { canModerateComments } from "@/lib/rbac";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id },
      include: { article: { select: { slug: true } } },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const isOwner = comment.userId === session.user.id;
    const isModerator = canModerateComments(session.user.role);

    if (!isOwner && !isModerator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteComment(id);
    revalidateTag(`article-${comment.article.slug}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
