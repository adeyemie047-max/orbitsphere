import type { Metadata } from "next";
import { Inter, Instrument_Serif, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

/** Long-form reading — industry-standard editorial body face */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-NG"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} ${instrumentSerif.variable} ${sourceSerif.variable}`}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
