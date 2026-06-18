import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "OrbitSphere <onboarding@resend.dev>";

export type SendEmailResult =
  | { ok: true }
  | { ok: false; reason: string };

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  if (!resend) {
    console.info("[email] skipped — RESEND_API_KEY not set", {
      to: input.to,
      subject: input.subject,
    });
    return { ok: false, reason: "not_configured" };
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    console.error("[email] send failed:", error);
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
}

function emailShell(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:Inter,Arial,sans-serif;color:#18181b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="padding:28px 32px 8px;border-bottom:3px solid #e62e2d;">
        <strong style="font-size:20px;letter-spacing:-0.02em;">OrbitSphere</strong>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 32px;line-height:1.65;font-size:15px;">
        ${content}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;background:#fafafa;font-size:12px;color:#71717a;">
        © ${new Date().getFullYear()} OrbitSphere Media Limited · Lagos · Abuja · London
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
  name?: string | null;
}) {
  const greeting = input.name ? `Hi ${input.name.split(" ")[0]},` : "Hi there,";

  return sendEmail({
    to: input.to,
    subject: "Reset your OrbitSphere password",
    html: emailShell(`
      <p style="margin:0 0 16px;">${greeting}</p>
      <p style="margin:0 0 24px;">We received a request to reset your password. Click the button below — this link expires in 1 hour.</p>
      <p style="margin:0 0 24px;">
        <a href="${input.resetUrl}" style="display:inline-block;background:#e62e2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
          Reset password
        </a>
      </p>
      <p style="margin:0;font-size:13px;color:#71717a;">If you didn't request this, you can safely ignore this email.</p>
    `),
  });
}

export async function sendNewsletterWelcomeEmail(input: { to: string }) {
  const url = siteUrl();

  return sendEmail({
    to: input.to,
    subject: "Welcome to the OrbitSphere briefing",
    html: emailShell(`
      <p style="margin:0 0 16px;">Welcome aboard,</p>
      <p style="margin:0 0 24px;">You're now subscribed to OrbitSphere — Nigeria's digital newspaper for politics, business, tech, and culture. Expect sharp analysis and the stories that matter across Africa.</p>
      <p style="margin:0 0 24px;">
        <a href="${url}" style="display:inline-block;background:#e62e2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
          Read today's edition
        </a>
      </p>
      <p style="margin:0;font-size:13px;color:#71717a;">
        <a href="${url}/api/v1/newsletter/unsubscribe?email=${encodeURIComponent(input.to)}" style="color:#71717a;">Unsubscribe</a>
      </p>
    `),
  });
}

export async function sendPremiumWelcomeEmail(input: {
  to: string;
  name?: string | null;
  plan: "monthly" | "annual";
  expiresAt: Date;
}) {
  const greeting = input.name ? `Hi ${input.name.split(" ")[0]},` : "Hi there,";
  const planLabel = input.plan === "monthly" ? "Monthly" : "Annual";
  const expires = input.expiresAt.toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const url = siteUrl();

  return sendEmail({
    to: input.to,
    subject: "Welcome to OrbitSphere Premium",
    html: emailShell(`
      <p style="margin:0 0 16px;">${greeting}</p>
      <p style="margin:0 0 16px;">Your <strong>${planLabel} Premium</strong> membership is active. Enjoy ad-free reading, early access, and exclusive analysis.</p>
      <p style="margin:0 0 24px;font-size:14px;color:#52525b;">Renews / expires: ${expires}</p>
      <p style="margin:0 0 24px;">
        <a href="${url}" style="display:inline-block;background:#e62e2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
          Start reading
        </a>
      </p>
    `),
  });
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendStaffInviteEmail(input: {
  to: string;
  name: string;
  role: string;
  resetUrl: string;
}) {
  const greeting = input.name.split(" ")[0];
  const roleLabel = input.role.charAt(0).toUpperCase() + input.role.slice(1);
  const url = siteUrl();

  return sendEmail({
    to: input.to,
    subject: `You're invited to join OrbitSphere as ${roleLabel}`,
    html: emailShell(`
      <p style="margin:0 0 16px;">Hi ${greeting},</p>
      <p style="margin:0 0 16px;">An administrator has invited you to join the OrbitSphere newsroom as a <strong>${roleLabel}</strong>.</p>
      <p style="margin:0 0 24px;">Set your password using the link below — it expires in 1 hour. Then sign in at ${url}/sign-in to access the dashboard.</p>
      <p style="margin:0 0 24px;">
        <a href="${input.resetUrl}" style="display:inline-block;background:#e62e2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
          Set your password
        </a>
      </p>
      <p style="margin:0;font-size:13px;color:#71717a;">If you weren't expecting this invite, you can ignore this email.</p>
    `),
  });
}
