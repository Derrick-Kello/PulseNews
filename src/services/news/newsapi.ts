import type { Article } from "@/src/types/article";
import { getNewsApiKey } from "@/src/constants/env";
import { stableArticleId } from "@/src/utils/article-id";
import { normalizeHttpUrl } from "@/src/utils/url-validation";

interface NewsApiArticle {
  title: string | null;
  description: string | null;
  url: string | null;
  urlToImage: string | null;
  publishedAt: string | null;
  source?: { name?: string | null };
  content?: string | null;
}

interface NewsApiResponse {
  status: string;
  articles?: NewsApiArticle[];
}

const NEWS_API_CATEGORY_MAP: Record<string, string> = {
  technology: "technology",
  business: "business",
  sports: "sports",
  politics: "general",
  entertainment: "entertainment",
  ai: "technology",
  africa: "general",
  local: "general",
  finance: "business",
  world: "general",
};

export async function fetchNewsApiHeadlines(categorySlug: string): Promise<Article[]> {
  const apiKey = getNewsApiKey();
  if (!apiKey) return [];

  const newsCategory = NEWS_API_CATEGORY_MAP[categorySlug] ?? "general";
  const params = new URLSearchParams({
    apiKey,
    language: "en",
    pageSize: "30",
    category: newsCategory,
  });

  const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const body = (await res.json()) as NewsApiResponse;
  if (body.status !== "ok" || !body.articles) return [];

  const out: Article[] = [];
  for (const item of body.articles) {
    if (!item.title || !item.url) continue;
    const articleUrl = normalizeHttpUrl(item.url);
    if (!articleUrl) continue;
    const sourceName = item.source?.name ?? "NewsAPI";
    const id = await stableArticleId({
      articleUrl,
      title: item.title,
      source: sourceName,
    });
    out.push({
      id,
      title: item.title,
      summary: item.description ?? "",
      source: sourceName,
      imageUrl: item.urlToImage,
      articleUrl,
      category: categorySlug,
      publishedAt: item.publishedAt ?? new Date().toISOString(),
      content: item.content ?? item.description ?? null,
      videoUrl: null,
      provider: "newsapi",
    });
  }
  return out;
}
