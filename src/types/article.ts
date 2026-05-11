export type NewsProvider = "newsapi" | "gnews" | "rss";

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  imageUrl: string | null;
  articleUrl: string;
  category: string;
  publishedAt: string;
  content: string | null;
  videoUrl: string | null;
  provider: NewsProvider;
}

export interface ArticleRow {
  id: string;
  title: string;
  summary: string;
  source: string;
  imageUrl: string | null;
  articleUrl: string;
  category: string;
  publishedAt: string;
  content: string | null;
  videoUrl: string | null;
  createdAt: string;
}
