import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NewsCard } from "@/src/components/news/NewsCard";
import { NEWS_CATEGORIES } from "@/src/constants/categories";
import { useAggregatedFeed } from "@/src/hooks/use-news-feed";
import { addSearchQuery } from "@/src/database/queries/search-history";
import { usePreferencesStore } from "@/src/store/preferences-store";
import type { Article } from "@/src/types/article";

export default function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const favoriteIds = usePreferencesStore((s) => s.favoriteCategoryIds);
  const setFavoriteIds = usePreferencesStore((s) => s.setFavoriteCategoryIds);
  const { data } = useAggregatedFeed();

  const articles = useMemo(() => data?.articles ?? [], [data?.articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Article[];
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q),
    );
  }, [articles, query]);

  const toggleCategory = useCallback(
    (id: string) => {
      const next = new Set(favoriteIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setFavoriteIds(Array.from(next));
    },
    [favoriteIds, setFavoriteIds],
  );

  const saveSearch = async () => {
    await addSearchQuery(query);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="border-b border-slate-200 px-4 pb-4 pt-2 dark:border-slate-800">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Discover</Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400">Search and tailor your interests</Text>
        <View className="mt-4 flex-row items-center rounded-2xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
          <TextInput
            placeholder="Search headlines, outlets, topics..."
            placeholderTextColor="#94a3b8"
            className="flex-1 py-3 text-base text-slate-900 dark:text-slate-100"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={saveSearch}
          />
          <Pressable onPress={saveSearch} className="rounded-xl bg-blue-600 px-3 py-2">
            <Text className="text-sm font-semibold text-white">Go</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Favorite categories</Text>
        <View className="mb-6 flex-row flex-wrap gap-2">
          {NEWS_CATEGORIES.map((cat) => {
            const active = favoriteIds.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                className={`rounded-full border px-4 py-2 ${
                  active
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    active ? "text-white" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Results</Text>
        {query.trim().length === 0 ? (
          <Text className="text-slate-600 dark:text-slate-300">Type a query to search your current feed cache.</Text>
        ) : filtered.length === 0 ? (
          <Text className="text-slate-600 dark:text-slate-300">No matches in the cached feed. Pull to refresh on Home.</Text>
        ) : (
          filtered.map((article) => <NewsCard key={article.id} article={article} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
