import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your OrbitSphere account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="container-main py-[80px] flex justify-center">
      <div className="w-full max-w-md bg-surface border border-border rounded-[14px] p-8">
        <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-foreground mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-sm text-text-muted text-center mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <ForgotPasswordForm />
        <p className="text-center text-xs text-text-muted mt-6">
          <Link href="/sign-in" className="text-gold hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
