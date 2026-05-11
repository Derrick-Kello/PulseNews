export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string | null;
  videoUrl: string;
  source: string;
  category: string;
  publishedAt: string;
}
