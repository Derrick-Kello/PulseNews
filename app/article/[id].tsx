import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import * as Clipboard from "expo-clipboard";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassIconButton } from "@/src/components/article/GlassIconButton";
import {
  getArticleById,
  recordArticleView,
  upsertArticles,
} from "@/src/database/queries/articles";
import {
  addBookmarkForArticle,
  isBookmarked,
  removeBookmark,
} from "@/src/database/queries/bookmarks";
import { BOOKMARKS_QUERY_KEY } from "@/src/hooks/use-news-feed";
import { useBookmarkStore } from "@/src/store/bookmark-store";
import type { Article } from "@/src/types/article";
import { normalizeImageUri } from "@/src/utils/image-uri";
import { openArticleInBrowser } from "@/src/utils/open-external-url";

/** Visible hero region below the status bar; inset top adds bleed under notch / island. */
const HERO_BODY_HEIGHT = 280;

export default function ArticleScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams<{ id: string }>();
  const idParam = params.id;
  const decodedId = typeof idParam === "string" ? decodeURIComponent(idParam) : "";

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!decodedId) return;
      setLoading(true);
      try {
        const row = await getArticleById(decodedId);
        if (!cancelled) setArticle(row);
        if (row) {
          await recordArticleView(row.id);
          const bm = await isBookmarked(row.id);
          if (!cancelled) {
            setBookmarked(bm);
            if (bm) useBookmarkStore.getState().add(row.id);
            else useBookmarkStore.getState().remove(row.id);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [decodedId]);

  const readingMinutes = useMemo(() => {
    if (!article?.summary) return 1;
    const words = article.summary.split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  }, [article?.summary]);

  const heroUri = useMemo(
    () => (article ? normalizeImageUri(article.imageUrl) : null),
    [article],
  );

  const chromeIconColor =
    heroUri && article ? "#ffffff" : colorScheme === "dark" ? "#f8fafc" : "#0f172a";

  const bookmarkIconColor =
    heroUri && article && bookmarked ? "#93c5fd" : chromeIconColor;

  const toggleBookmark = async () => {
    if (!article) return;
    try {
      if (bookmarked) {
        await removeBookmark(article.id);
        useBookmarkStore.getState().remove(article.id);
        setBookmarked(false);
        queryClient.setQueryData<Article[]>(BOOKMARKS_QUERY_KEY, (old) =>
          (old ?? []).filter((a) => a.id !== article.id),
        );
      } else {
        await addBookmarkForArticle(article.id);
        await upsertArticles([article]);
        useBookmarkStore.getState().add(article.id);
        setBookmarked(true);
        queryClient.setQueryData<Article[]>(BOOKMARKS_QUERY_KEY, (old) => {
          const list = old ?? [];
          if (list.some((a) => a.id === article.id)) return list;
          return [article, ...list];
        });
      }
      await queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY });
    } catch {
      Alert.alert("Bookmark couldn’t update", "Please try again.");
    }
  };

  const openOriginal = async () => {
    if (!article?.articleUrl) return;
    const result = await openArticleInBrowser(article.articleUrl);
    if (!result.ok && result.message) {
      Alert.alert("Couldn’t open article", result.message, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy link",
          onPress: async () => {
            const url = article.articleUrl;
            if (url) {
              await Clipboard.setStringAsync(url);
              Alert.alert("Copied", "Link is on your clipboard — paste it in Safari or Chrome.");
            }
          },
        },
        {
          text: "Share…",
          onPress: async () => {
            await Share.share({
              title: article.title,
              message: `${article.title}\n${article.articleUrl}`,
            });
          },
        },
      ]);
    }
  };

  const share = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n${article.articleUrl}`,
      });
    } catch {
      Alert.alert("Share unavailable", "Try Copy link from the previous screen after opening Read full story.");
    }
  };

  const heroTotalHeight = HERO_BODY_HEIGHT + insets.top;
  const contentTopPaddingNoHero = insets.top + 52;

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style={heroUri && article ? "light" : colorScheme === "dark" ? "light" : "dark"} />

      {loading ? (
        <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950" edges={["top", "bottom"]}>
          <ActivityIndicator />
        </SafeAreaView>
      ) : !article ? (
        <SafeAreaView className="flex-1 bg-white px-6 dark:bg-slate-950" edges={["top", "bottom"]}>
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-base text-slate-600 dark:text-slate-300">
              Article not found in cache. Open it from the feed first or pull to refresh on Home.
            </Text>
            <Pressable onPress={() => router.back()} className="mt-6 rounded-full bg-blue-600 px-6 py-3">
              <Text className="font-semibold text-white">Go back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.flex}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom, 16) + 24,
            }}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {heroUri ? (
              <View style={{ width: "100%", height: heroTotalHeight }}>
                <Image
                  source={{ uri: heroUri }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  accessibilityLabel={article.title}
                />
              </View>
            ) : null}

            <View
              className="gap-4 px-5"
              style={{
                paddingTop: heroUri ? 20 : contentTopPaddingNoHero,
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                {article.source} · {article.category}
              </Text>
              <Text className="text-2xl font-bold leading-snug text-slate-900 dark:text-white">{article.title}</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(article.publishedAt).toLocaleString()} · ~{readingMinutes} min read
              </Text>
              {article.summary ? (
                <Text className="text-base leading-relaxed text-slate-800 dark:text-slate-100">{article.summary}</Text>
              ) : null}
              <View className="flex-row gap-3 pt-2">
                <Pressable
                  onPress={openOriginal}
                  className="flex-1 items-center rounded-2xl bg-blue-600 py-3"
                >
                  <Text className="font-semibold text-white">Read full story</Text>
                </Pressable>
                <Pressable
                  onPress={openOriginal}
                  accessibilityLabel="Open in browser"
                  className="items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                >
                  <Ionicons name="open-outline" size={22} color="#2563eb" />
                </Pressable>
              </View>
              <View className="rounded-3xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">Related soon</Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Recommendations will map to categories once personalization expands.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View
            pointerEvents="box-none"
            style={[
              styles.chromeBar,
              {
                paddingTop: insets.top,
                paddingHorizontal: 12,
              },
            ]}
          >
            <GlassIconButton onPress={() => router.back()} accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={26} color={chromeIconColor} />
            </GlassIconButton>
            <View style={styles.chromeRight}>
              <GlassIconButton onPress={toggleBookmark} accessibilityLabel={bookmarked ? "Remove bookmark" : "Bookmark"}>
                <Ionicons
                  name={bookmarked ? "bookmark" : "bookmark-outline"}
                  size={22}
                  color={bookmarkIconColor}
                />
              </GlassIconButton>
              <GlassIconButton onPress={share} accessibilityLabel="Share article">
                <Ionicons name="share-outline" size={22} color={chromeIconColor} />
              </GlassIconButton>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  chromeBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chromeRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
