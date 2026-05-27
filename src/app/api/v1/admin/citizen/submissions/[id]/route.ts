import { NextRequest, NextResponse } from "next/server";
import {
  getCitizenSubmissionById,
  reviewCitizenSubmission,
} from "@/lib/admin-citizen";
import { citizenReviewSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireModerator } from "@/lib/api-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireModerator();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = citizenReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const existing = await getCitizenSubmissionById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const updated = await reviewCitizenSubmission(id, parsed.data.status);
    return NextResponse.json({
      data: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
