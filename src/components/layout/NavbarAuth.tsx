"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

const linkClass =
  "font-ui text-[12px] font-medium px-2 py-1.5 text-[var(--ds-nav-text)] hover:text-[var(--ds-nav-text-active)] transition-colors";

export default function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-16 h-8 bg-white/10 animate-pulse hidden sm:block" />;
  }

  if (!session?.user) {
    return (
      <Button href="/sign-in" size="sm" variant="gold" className="hidden sm:inline-flex">
        Sign In
      </Button>
    );
  }

  const isEditorial = ["admin", "editor", "journalist"].includes(
    session.user.role ?? ""
  );

  return (
    <div className="hidden sm:flex items-center gap-0.5">
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
          className="font-ui text-[12px] font-semibold px-2 py-1.5 text-white border border-white/25 hover:bg-white/10 transition-colors"
        >
          Newsroom
        </Link>
      )}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="font-ui text-[11px] text-[var(--ds-nav-text)] hover:text-white cursor-pointer bg-transparent border-none px-2"
      >
        Sign out
      </button>
    </div>
  );
}
