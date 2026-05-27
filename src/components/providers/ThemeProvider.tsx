"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Theme toggle applies to the public newspaper site only (`.site-public`). */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="orbitsphere-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
