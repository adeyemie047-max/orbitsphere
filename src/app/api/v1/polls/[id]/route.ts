import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPollById, castPollVote } from "@/lib/polls";
import { parseJsonBody } from "@/lib/api-admin";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const voterKey = request.headers.get("x-voter-key") ?? undefined;

  try {
    const poll = await getPollById(id, voterKey ?? undefined);
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }
    return NextResponse.json({ data: poll });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

const voteSchema = z.object({
  optionId: z.string().uuid(),
  voterKey: z.string().min(8).max(128),
});

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id;

  try {
    const result = await castPollVote(
      id,
      parsed.data.optionId,
      parsed.data.voterKey,
      userId
    );
    if (result && "error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
