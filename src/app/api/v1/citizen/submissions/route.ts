import { NextRequest, NextResponse } from "next/server";
import { CitizenSubmissionStatus } from "@prisma/client";
import { listCitizenSubmissions } from "@/lib/admin-citizen";
import { isEditorialSession } from "@/lib/api-auth";
import { parsePagination, requireAdmin } from "@/lib/api-admin";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePagination(searchParams);
  const statusParam = searchParams.get("status");
  const status =
    statusParam &&
    Object.values(CitizenSubmissionStatus).includes(
      statusParam as CitizenSubmissionStatus
    )
      ? (statusParam as CitizenSubmissionStatus)
      : undefined;

  try {
    const result = await listCitizenSubmissions({ page, limit, status });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
