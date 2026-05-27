import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About OrbitSphere",
  description: "Learn about OrbitSphere — The Future of African Journalism.",
};

export default function AboutPage() {
  return (
    <div className="container-main py-[80px] max-w-3xl">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-black text-foreground mb-6">
        About OrbitSphere
      </h1>
      <p className="text-[17px] text-text-secondary leading-[1.82] mb-6">
        OrbitSphere is a futuristic, premium African digital newspaper that combines
        cinematic design, AI-powered features, and world-class journalism. Built for
        Nigeria and the Pan-African diaspora, we deliver trustworthy, modern, and deeply
        engaging news experiences.
      </p>
      <p className="text-[17px] text-text-secondary leading-[1.82] mb-8">
        Our mission is simple: keep Africa informed, engaged, and empowered through
        storytelling driven by technology and editorial excellence.
      </p>
      <div className="flex gap-4 flex-wrap">
        <Button href="/">Back to Home</Button>
        <Button href="/search" variant="outline">
          Browse Stories
        </Button>
      </div>
    </div>
  );
}
