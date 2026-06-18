import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { inviteStaffUser } from "@/lib/admin-invite";
import { staffInviteSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = staffInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await inviteStaffUser({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      username: parsed.data.username,
      role: parsed.data.role as UserRole,
    });

    return NextResponse.json(
      {
        data: result.user,
        message: result.emailSent
          ? "Invite sent. They can set a password via the email link."
          : "Account created. Email was not sent — share the password reset link manually.",
        devResetUrl: result.devResetUrl,
        emailSent: result.emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invite failed";
    if (message.includes("already exists")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
