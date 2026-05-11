import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NewsCard } from "@/src/components/news/NewsCard";
import { useBookmarksQuery } from "@/src/hooks/use-news-feed";
import type { Article } from "@/src/types/article";

export default function BookmarksScreen() {
  const { data, isPending } = useBookmarksQuery();

  const renderItem = useCallback(({ item }: { item: Article }) => <NewsCard article={item} />, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="border-b border-slate-200 px-4 pb-4 pt-2 dark:border-slate-800">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Bookmarks</Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400">Saved for offline reading</Text>
      </View>
      {isPending ? (
        <Text className="px-4 pt-6 text-slate-600 dark:text-slate-300">Loading bookmarks…</Text>
      ) : !data?.length ? (
        <Text className="px-4 pt-6 text-slate-600 dark:text-slate-300">
          Nothing saved yet. Tap the bookmark icon inside an article to keep it here.
        </Text>
      ) : (
        <FlashList
          style={{ flex: 1 }}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
