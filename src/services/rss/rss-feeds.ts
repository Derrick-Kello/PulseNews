import type { Article } from "@/src/types/article";
import { RSS_FEED_SOURCES } from "@/src/constants/rss-feeds";
import { parseFeedXml } from "@/src/services/rss/parse-feed-xml";
import { stableArticleId } from "@/src/utils/article-id";
import { resolveArticleUrl } from "@/src/utils/url-validation";

const FEED_TIMEOUT_MS = 18_000;

const FETCH_USER_AGENTS = [
  "Mozilla/5.0 (compatible; NewsAggregatorApp/1.0)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
];

async function fetchFeedXmlWithFallback(feedUrl: string): Promise<string | null> {
  for (const userAgent of FETCH_USER_AGENTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
    try {
      const res = await fetch(feedUrl, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": userAgent,
          Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      if (xml.length > 0) return xml;
    } catch {
      continue;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

export async function fetchRssArticlesForSources(categorySlug: string): Promise<Article[]> {
  const feeds = RSS_FEED_SOURCES.filter(
    (f) => f.defaultCategory === categorySlug || categorySlug === "world",
  );
  const limited = feeds.slice(0, 6);
  const settled = await Promise.allSettled(limited.map((f) => fetchSingleFeed(f.url, f.name, categorySlug)));
  const out: Article[] = [];
  for (const s of settled) {
    if (s.status === "fulfilled") out.push(...s.value);
  }
  return out;
}

async function fetchSingleFeed(feedUrl: string, feedName: string, categorySlug: string): Promise<Article[]> {
  const xml = await fetchFeedXmlWithFallback(feedUrl);
  if (!xml) return [];

  let parsedItems;
  try {
    parsedItems = parseFeedXml(xml);
  } catch {
    return [];
  }

  const out: Article[] = [];
  const capped = parsedItems.slice(0, 15);

  for (const item of capped) {
    const title = item.title.trim();
    if (!title) continue;

    const resolvedLink = resolveArticleUrl(item.link, feedUrl);
    if (!resolvedLink) continue;

    const summary = item.summary ?? "";
    const publishedAt = item.publishedAt;
    const imageUrl = item.imageUrl;

    const id = await stableArticleId({
      articleUrl: resolvedLink,
      title,
      source: feedName,
    });

    out.push({
      id,
      title,
      summary,
      source: feedName,
      imageUrl,
      articleUrl: resolvedLink,
      category: categorySlug,
      publishedAt,
      content: item.content,
      videoUrl: null,
      provider: "rss",
    });
  }

  return out;
}
