import { NextRequest, NextResponse } from "next/server";
import { listPendingComments } from "@/lib/admin-comments";
import { isEditorialSession } from "@/lib/api-auth";
import { parsePagination, requireModerator } from "@/lib/api-admin";

export async function GET(request: NextRequest) {
  const session = await requireModerator();
  if (!isEditorialSession(session)) return session;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePagination(searchParams);

  try {
    const result = await listPendingComments({ page, limit });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
