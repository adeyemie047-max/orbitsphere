"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

const linkClass =
  "font-ui text-[12px] font-medium px-2 py-1.5 text-[var(--ds-nav-text)] hover:text-[var(--ds-ink)] transition-colors";

export default function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-16 h-8 bg-[rgba(10,10,10,0.06)] animate-pulse hidden sm:block rounded-[2px]" />;
  }

  if (!session?.user) {
    return (
      <div className="hidden sm:flex items-center gap-2">
        <Button
          href="/sign-in"
          size="sm"
          variant="outline"
          className="rounded-[2px] border-[var(--ds-border)] text-[var(--ds-ink)] hover:bg-[rgba(10,10,10,0.04)]"
        >
          Sign In
        </Button>
        <Button href="/premium" size="sm" variant="primary" className="rounded-[2px]">
          Subscribe
        </Button>
      </div>
    );
  }

  const isPremium = session.user.isPremium;

  const isEditorial = ["admin", "editor", "journalist"].includes(
    session.user.role ?? ""
  );

  return (
    <div className="hidden sm:flex items-center gap-0.5">
      {isPremium ? (
        <Link
          href="/profile"
          className="font-ui text-[10px] font-bold uppercase tracking-wide text-[var(--ds-ink)] bg-[var(--ds-accent)] px-2 py-1 rounded-[2px]"
        >
          Premium
        </Link>
      ) : (
        <Link href="/premium" className={linkClass}>
          Subscribe
        </Link>
      )}
      <Link href="/feed" className={linkClass}>
        Feed
      </Link>
      <Link href="/bookmarks" className={linkClass}>
        Saved
      </Link>
      <Link href="/profile" className={`${linkClass} max-w-[90px] truncate`}>
        {session.user.name?.split(" ")[0] ?? "Profile"}
      </Link>
      {isEditorial && (
        <Link
          href="/dashboard"
          className="font-ui text-[12px] font-semibold px-2 py-1.5 text-[var(--ds-ink)] border border-[var(--ds-border)] hover:bg-[rgba(10,10,10,0.04)] transition-colors rounded-[2px]"
        >
          Newsroom
        </Link>
      )}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="font-ui text-[11px] text-[var(--ds-nav-text)] hover:text-[var(--ds-ink)] cursor-pointer bg-transparent border-none px-2"
      >
        Sign out
      </button>
    </div>
  );
}
