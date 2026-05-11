import type { Article } from "@/src/types/article";

/** Merge lists and drop duplicates by `id`, keeps first occurrence (newest-first lists should pass preferred order first). */
export function dedupeArticles(lists: Article[][]): Article[] {
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const list of lists) {
    for (const a of list) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      out.push(a);
    }
  }
  return out;
}

export function sortByPublishedAtDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
