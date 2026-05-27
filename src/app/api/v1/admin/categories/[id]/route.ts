import { NextRequest, NextResponse } from "next/server";
import {
  deleteCategory,
  updateCategory,
} from "@/lib/admin-categories";
import { categoryUpdateSchema } from "@/lib/admin-schemas";
import { db } from "@/lib/db";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";
import { revalidateTag } from "next/cache";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = categoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const category = await updateCategory(id, parsed.data);
    revalidateTag("articles");
    revalidateTag(`category-${existing.slug}`);
    if (category.slug !== existing.slug) {
      revalidateTag(`category-${category.slug}`);
    }

    return NextResponse.json({ data: category });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  try {
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await deleteCategory(id);
    revalidateTag("articles");
    revalidateTag(`category-${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    if (message.includes("cannot be deleted")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
