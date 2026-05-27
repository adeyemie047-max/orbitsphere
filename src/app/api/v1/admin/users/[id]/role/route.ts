import { NextRequest, NextResponse } from "next/server";
import { roleUpdateSchema } from "@/lib/admin-schemas";
import { updateUserRole } from "@/lib/admin-users";
import {
  isEditorialSession,
} from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = roleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const user = await updateUserRole(
      id,
      parsed.data.role,
      session.userId
    );
    return NextResponse.json({ data: user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Update failed";
    if (message.includes("Cannot demote")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
