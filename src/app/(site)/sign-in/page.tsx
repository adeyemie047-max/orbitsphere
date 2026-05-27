import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to OrbitSphere to save articles, comment, and personalize your feed.",
};

export default function SignInPage() {
  return (
    <div className="container-main py-8 sm:py-12 lg:py-16 flex justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg sm:rounded-[14px] p-6 sm:p-8">
        <h1 className="font-[family-name:var(--font-serif)] text-[24px] sm:text-[28px] font-black text-foreground mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-sm text-text-muted text-center mb-8">
          Sign in to bookmark articles and join the conversation.
        </p>
        <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
          <SignInForm />
        </Suspense>
        <p className="text-center text-xs text-text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
