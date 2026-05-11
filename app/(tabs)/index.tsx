import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OfflineBanner } from "@/src/components/layout/OfflineBanner";
import { FeedSkeleton } from "@/src/components/news/FeedSkeleton";
import { NewsCard } from "@/src/components/news/NewsCard";
import { NEWS_CATEGORIES } from "@/src/constants/categories";
import { useAggregatedFeed } from "@/src/hooks/use-news-feed";
import { useNetworkStatus } from "@/src/hooks/use-network-status";
import { usePreferencesStore } from "@/src/store/preferences-store";
import type { Article } from "@/src/types/article";

export default function HomeScreen() {
  const feedCategorySlug = usePreferencesStore((s) => s.feedCategorySlug);
  const setFeedCategorySlug = usePreferencesStore((s) => s.setFeedCategorySlug);
  const favoriteIds = usePreferencesStore((s) => s.favoriteCategoryIds);

  const { data, isPending, isRefetching, refetch, error } = useAggregatedFeed();
  const { isOffline } = useNetworkStatus();

  const articles = useMemo(() => data?.articles ?? [], [data?.articles]);
  const trending = useMemo(() => articles.slice(0, 5), [articles]);
  const listData = useMemo(() => articles.slice(5), [articles]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const categoryChips = useMemo(
    () => NEWS_CATEGORIES.filter((c) => favoriteIds.includes(c.id)),
    [favoriteIds],
  );

  const renderItem = useCallback(({ item }: { item: Article }) => <NewsCard article={item} />, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <OfflineBanner visible={isOffline} />
      <View className="border-b border-slate-200/80 bg-white/80 px-4 pb-3 pt-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pulse News</Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400">Your aggregated briefing</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          <View className="flex-row gap-2">
            {categoryChips.map((cat) => {
              const active = feedCategorySlug === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setFeedCategorySlug(cat.id)}
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
        </ScrollView>
      </View>

      {isPending ? (
        <FeedSkeleton />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="warning-outline" size={48} color="#f97316" />
          <Text className="mt-4 text-center text-base text-slate-700 dark:text-slate-200">
            We couldn&apos;t refresh the feed. Pull to retry or check your connection.
          </Text>
        </View>
      ) : (
        <FlashList
          style={{ flex: 1 }}
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={onRefresh}
          ListHeaderComponent={
            trending.length ? (
              <View className="mb-2 px-4 pt-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-slate-900 dark:text-white">Trending</Text>
                  <View className="rounded-full bg-red-500/10 px-3 py-1">
                    <Text className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                      Live mix
                    </Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3 pb-2">
                    {trending.map((article) => (
                      <View key={article.id} className="w-72">
                        <NewsCard article={article} compact />
                      </View>
                    ))}
                  </View>
                </ScrollView>
                <Text className="mt-4 px-1 text-lg font-semibold text-slate-900 dark:text-white">
                  Latest headlines
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center px-6 py-16">
              <Text className="text-center text-slate-600 dark:text-slate-300">
                No articles yet. Pull to refresh or adjust categories in Discover.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </SafeAreaView>
  );
}
