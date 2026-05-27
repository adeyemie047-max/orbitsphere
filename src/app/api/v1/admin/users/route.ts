import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { listAdminUsers } from "@/lib/admin-users";
import { isEditorialSession } from "@/lib/api-auth";
import { parsePagination, requireAdmin } from "@/lib/api-admin";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePagination(searchParams);
  const roleParam = searchParams.get("role");
  const q = searchParams.get("q") ?? undefined;

  const role =
    roleParam && Object.values(UserRole).includes(roleParam as UserRole)
      ? (roleParam as UserRole)
      : undefined;

  try {
    const result = await listAdminUsers({ page, limit, role, q });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
