"use client";

export default function NavbarDate() {
  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return <span suppressHydrationWarning>{today}</span>;
}
