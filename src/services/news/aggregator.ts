import type { Article } from "@/src/types/article";
import { upsertArticles } from "@/src/database/queries/articles";
import { dedupeArticles, sortByPublishedAtDesc } from "@/src/utils/dedupe";
import { fetchGNewsHeadlines } from "@/src/services/news/gnews";
import { fetchNewsApiHeadlines } from "@/src/services/news/newsapi";
import { fetchRssArticlesForSources } from "@/src/services/rss/rss-feeds";

export interface AggregatedFeedResult {
  articles: Article[];
  errors: string[];
}

export async function fetchAndMergeFeed(categorySlug: string): Promise<AggregatedFeedResult> {
  const errors: string[] = [];

  const [newsApi, gnews, rss] = await Promise.all([
    fetchNewsApiHeadlines(categorySlug).catch((e: Error) => {
      errors.push(`NewsAPI: ${e.message}`);
      return [] as Article[];
    }),
    fetchGNewsHeadlines(categorySlug).catch((e: Error) => {
      errors.push(`GNews: ${e.message}`);
      return [] as Article[];
    }),
    fetchRssArticlesForSources(categorySlug).catch((e: Error) => {
      errors.push(`RSS: ${e.message}`);
      return [] as Article[];
    }),
  ]);

  const merged = dedupeArticles([newsApi, gnews, rss]);
  const sorted = sortByPublishedAtDesc(merged);

  try {
    await upsertArticles(sorted);
  } catch (e) {
    errors.push(`SQLite: ${e instanceof Error ? e.message : "persist failed"}`);
  }

  return { articles: sorted, errors };
}
