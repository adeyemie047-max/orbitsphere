import { NextRequest, NextResponse } from "next/server";
import { citizenSubmitSchema } from "@/lib/admin-schemas";
import { submitCitizenStory } from "@/lib/admin-citizen";
import { parseJsonBody } from "@/lib/api-admin";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, "citizen:submit", 3);
  if (limited) return limited;  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = citizenSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const submission = await submitCitizenStory(parsed.data);
    return NextResponse.json(
      {
        data: {
          id: submission.id,
          status: submission.status,
          submittedAt: submission.submittedAt.toISOString(),
        },
        message:
          "Thank you! Your story has been submitted and will be reviewed by our editorial team.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to submit story at this time" },
      { status: 503 }
    );
  }
}
