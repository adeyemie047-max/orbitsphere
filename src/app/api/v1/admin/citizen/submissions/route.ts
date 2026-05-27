import { NextRequest, NextResponse } from "next/server";
import { CitizenSubmissionStatus } from "@prisma/client";
import {
  getCitizenSubmissionById,
  listCitizenSubmissions,
  reviewCitizenSubmission,
} from "@/lib/admin-citizen";
import { citizenReviewSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, parsePagination, requireModerator } from "@/lib/api-admin";

export async function GET(request: NextRequest) {
  const session = await requireModerator();
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
      : CitizenSubmissionStatus.pending;

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
