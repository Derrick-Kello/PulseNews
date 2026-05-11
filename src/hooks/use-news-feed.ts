import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Article } from "@/src/types/article";
import { getArticlesByCategory } from "@/src/database/queries/articles";
import {
  addBookmarkForArticle,
  listBookmarkedArticles,
  removeBookmark,
} from "@/src/database/queries/bookmarks";
import { fetchAndMergeFeed } from "@/src/services/news/aggregator";
import { useBookmarkStore } from "@/src/store/bookmark-store";
import { usePreferencesStore } from "@/src/store/preferences-store";

/** Shared key so bookmark mutations update the Bookmarks tab cache immediately. */
export const BOOKMARKS_QUERY_KEY = ["bookmarks"] as const;

export function useAggregatedFeed(categorySlug?: string) {
  const feedSlug = usePreferencesStore((s) => s.feedCategorySlug);
  const slug = categorySlug ?? feedSlug;

  return useQuery({
    queryKey: ["feed", slug],
    queryFn: async () => {
      const remote = await fetchAndMergeFeed(slug);
      const fromDb = await getArticlesByCategory(slug === "all" ? null : slug, 120);
      return {
        articles: fromDb.length ? fromDb : remote.articles,
        errors: remote.errors,
      };
    },
  });
}

export function useBookmarksQuery() {
  return useQuery({
    queryKey: BOOKMARKS_QUERY_KEY,
    queryFn: () => listBookmarkedArticles(),
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: Article) => {
      const store = useBookmarkStore.getState();
      if (store.has(article.id)) {
        await removeBookmark(article.id);
        store.remove(article.id);
      } else {
        await addBookmarkForArticle(article.id);
        await upsertArticleSnapshot(article);
        store.add(article.id);
      }
    },
    onSuccess: (_data, article) => {
      qc.setQueryData<Article[]>(BOOKMARKS_QUERY_KEY, (old) => {
        const list = old ?? [];
        const store = useBookmarkStore.getState();
        if (store.has(article.id)) {
          if (list.some((a) => a.id === article.id)) return list;
          return [article, ...list];
        }
        return list.filter((a) => a.id !== article.id);
      });
      void qc.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY });
    },
  });
}

async function upsertArticleSnapshot(article: Article): Promise<void> {
  const { upsertArticles } = await import("@/src/database/queries/articles");
  await upsertArticles([article]);
}
