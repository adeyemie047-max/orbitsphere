import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join OrbitSphere — Africa's digital newspaper.",
};

export default function RegisterPage() {
  return (
    <div className="container-main py-[80px] flex justify-center">
      <div className="w-full max-w-md bg-surface border border-border rounded-[14px] p-8">
        <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-foreground mb-2 text-center">
          Join OrbitSphere
        </h1>
        <p className="text-sm text-text-muted text-center mb-8">
          Create a free reader account to bookmark and comment.
        </p>
        <RegisterForm />
        <p className="text-center text-xs text-text-muted mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
