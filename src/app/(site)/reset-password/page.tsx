import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Choose a new password for your OrbitSphere account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="container-main py-[80px] flex justify-center">
      <div className="w-full max-w-md bg-surface border border-border rounded-[14px] p-8">
        <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-foreground mb-2 text-center">
          New Password
        </h1>
        <p className="text-sm text-text-muted text-center mb-8">
          Choose a strong password for your account.
        </p>
        <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
