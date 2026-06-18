export type CategorySlug =
  | "politics"
  | "metro"
  | "business"
  | "technology"
  | "education"
  | "agriculture"
  | "entertainment"
  | "sports"
  | "opinion"
  | "lifestyle"
  | "faith-culture";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  color: "gold" | "cyan" | "blue" | "breaking" | "live";
}

export interface Author {
  id: string;
  name: string;
  role: string;
  initials: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage?: string;
  imageCaption?: string;
  author: Author;
  category: Category;
  status: "draft" | "scheduled" | "published" | "archived";
  isBreaking: boolean;
  isFeatured: boolean;
  isInvestigative: boolean;
  isLiveBlog?: boolean;
  viewsCount: number;
  readTime: number;
  publishedAt: string;
  tags: string[];
  aiSummary?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  initials: string;
  body: string;
  createdAt: string;
}

export interface VideoStory {
  id: string;
  title: string;
  category: Category;
  duration: string;
  channel: string;
  publishedAt: string;
  thumbnail?: string;
  /** Direct MP4/WebM URL or YouTube embed URL for playback */
  playbackUrl: string;
  /** "html5" for native video; "youtube" for iframe embed */
  playbackType?: "html5" | "youtube";
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  endsIn: string;
}

export interface BreakingHeadline {
  id: string;
  text: string;
  slug?: string;
}
