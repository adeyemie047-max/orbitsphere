"use client";

import { useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  playbackType?: "html5" | "youtube";
}

function toYoutubeEmbed(url: string): string {
  if (url.includes("youtube.com/embed/") || url.includes("youtube-nocookie.com/embed/")) {
    return url;
  }
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/
  );
  if (match?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  return url;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  playbackType = "html5",
}: VideoPlayerProps) {
  const [error, setError] = useState<string | null>(null);

  if (playbackType === "youtube" || src.includes("youtube.com") || src.includes("youtu.be")) {
    const embedUrl = toYoutubeEmbed(src);
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={`${embedUrl}?rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        src={src}
        className="w-full h-full object-contain bg-black"
        onError={() => setError("This video could not be loaded.")}
      >
        Your browser does not support video playback.
      </video>
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center bg-black/80">
          <p className="font-ui text-sm text-white/80">{error}</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-xs font-semibold text-[var(--ds-accent,#C8FF00)] hover:underline"
          >
            Open video in new tab
          </a>
        </div>
      )}
    </div>
  );
}
