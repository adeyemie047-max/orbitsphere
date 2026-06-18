import { videoStories } from "@/lib/data";
import type { VideoStory } from "@/lib/types";

export function getVideoById(id: string): VideoStory | undefined {
  return videoStories.find((video) => video.id === id);
}

export function getAllVideoIds(): string[] {
  return videoStories.map((video) => video.id);
}

export function getAllVideos(): VideoStory[] {
  return videoStories;
}
