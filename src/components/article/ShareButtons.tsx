"use client";

import { useCallback, useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/article/${slug}`;
  }, [slug]);

  const share = (platform: string) => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (links[platform]) {
      window.open(links[platform], "_blank", "noopener,noreferrer,width=600,height=500");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const buttons = [
    { id: "twitter", label: "Share on X", icon: "𝕏" },
    { id: "whatsapp", label: "Share on WhatsApp", icon: "📱" },
    { id: "facebook", label: "Share on Facebook", icon: "f" },
    { id: "linkedin", label: "Share on LinkedIn", icon: "in" },
  ] as const;

  return (
    <div className="flex items-center gap-2.5 flex-wrap mb-6 sm:mb-8">
      <span className="font-ui text-xs text-text-muted mr-1">Share:</span>
      {buttons.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => share(id)}
          className="w-[38px] h-[38px] rounded-full bg-surface-2 border border-border flex items-center justify-center cursor-pointer text-[13px] hover:bg-[rgba(230,46,45,0.08)] hover:border-[var(--ds-accent)] transition-all"
          aria-label={label}
        >
          {icon}
        </button>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="h-[38px] px-4 rounded-full bg-surface-2 border border-border flex items-center justify-center cursor-pointer text-[12px] font-ui text-text-secondary hover:bg-[rgba(230,46,45,0.08)] hover:border-[var(--ds-accent)] transition-all"
        aria-label="Copy link"
      >
        {copied ? "Copied!" : "🔗 Copy Link"}
      </button>
    </div>
  );
}
