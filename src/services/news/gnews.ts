import type { Article } from "@/src/types/article";
import { getGNewsApiKey } from "@/src/constants/env";
import { stableArticleId } from "@/src/utils/article-id";
import { normalizeHttpUrl } from "@/src/utils/url-validation";

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
}

interface GNewsResponse {
  articles: GNewsArticle[];
}

const GNEWS_CATEGORY_MAP: Record<string, string> = {
  technology: "technology",
  business: "business",
  sports: "sports",
  politics: "world",
  entertainment: "entertainment",
  ai: "technology",
  africa: "world",
  local: "general",
  finance: "business",
  world: "world",
};

export async function fetchGNewsHeadlines(categorySlug: string): Promise<Article[]> {
  const token = getGNewsApiKey();
  if (!token) return [];

  const topic = GNEWS_CATEGORY_MAP[categorySlug] ?? "general";
  const params = new URLSearchParams({
    token,
    lang: "en",
    max: "30",
    category: topic,
  });

  const url = `https://gnews.io/api/v4/top-headlines?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const body = (await res.json()) as GNewsResponse;
  if (!body.articles?.length) return [];

  const out: Article[] = [];
  for (const item of body.articles) {
    const articleUrl = normalizeHttpUrl(item.url);
    if (!articleUrl) continue;
    const sourceName = item.source?.name ?? "GNews";
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
      imageUrl: item.image,
      articleUrl,
      category: categorySlug,
      publishedAt: item.publishedAt,
      content: item.description ?? null,
      videoUrl: null,
      provider: "gnews",
    });
  }
  return out;
}
