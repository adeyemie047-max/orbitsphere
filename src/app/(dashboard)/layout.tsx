import type { Metadata } from "next";
import AdminShell from "@/components/layout/AdminShell";

export const metadata: Metadata = {
  title: "Newsroom Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
