import { NextRequest, NextResponse } from "next/server";
import {
  createCategory,
  deleteCategory,
  listAdminCategories,
  updateCategory,
} from "@/lib/admin-categories";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  try {
    const data = await listAdminCategories();
    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = categoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const category = await createCategory(parsed.data);
    revalidateTag("articles");
    revalidateTag(`category-${category.slug}`);
    return NextResponse.json({ data: category }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable or slug conflict" },
      { status: 503 }
    );
  }
}
