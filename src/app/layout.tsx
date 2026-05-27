import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Serif_Display, Poppins } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import PublicSiteShell from "@/components/layout/PublicSiteShell";
import BreakingTicker from "@/components/layout/BreakingTicker";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "OrbitSphere — Independent African Journalism",
    template: "%s | OrbitSphere",
  },
  description:
    "OrbitSphere is Nigeria's premier digital newspaper — delivering fearless, intelligent journalism that keeps Africa informed, engaged, and empowered.",
  keywords: [
    "Nigeria news",
    "African journalism",
    "Politics",
    "Business",
    "Technology",
    "OrbitSphere",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "OrbitSphere Newspaper",
    title: "OrbitSphere — The Future of African Journalism",
    description:
      "Trustworthy, modern, and deeply engaging news experiences for African audiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrbitSphere Newspaper",
    description: "The Future of African Journalism",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${dmSerif.variable} ${poppins.variable}`}
    >
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <ThemeProvider>
          <AuthProvider>
            <PublicSiteShell ticker={<BreakingTicker />}>{children}</PublicSiteShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
