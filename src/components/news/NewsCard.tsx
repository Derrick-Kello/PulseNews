import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { memo, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { Article } from "@/src/types/article";
import { normalizeImageUri } from "@/src/utils/image-uri";

/** Match Tailwind `h-44` (11 × 4px spacing scale = 176 logical px) */
const THUMB_HEIGHT = 176;

interface Props {
  article: Article;
  /** Tighter horizontal margins for carousel layouts */
  compact?: boolean;
}

function NewsCardComponent({ article, compact }: Props) {
  const outer = compact ? "mb-4" : "mx-4 mb-4";
  const imageUri = useMemo(() => normalizeImageUri(article.imageUrl), [article.imageUrl]);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [article.id, imageUri]);

  const hasRenderableImage = Boolean(imageUri) && !imageFailed;

  return (
    <Link
      href={
        {
          pathname: "/article/[id]",
          params: { id: article.id },
        } as unknown as Href
      }
      asChild
    >
      <Pressable className="active:opacity-90">
        <View
          className={`${outer} overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 shadow-sm shadow-slate-900/5 dark:border-slate-700/80 dark:bg-slate-900/70`}
        >
          {hasRenderableImage && imageUri ? (
            <View
              className="w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
              style={{ height: THUMB_HEIGHT }}
            >
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                accessibilityLabel={article.title}
                onError={() => setImageFailed(true)}
              />
            </View>
          ) : null}

          <View className="gap-2 p-4">
            <Text className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {article.source} · {article.category}
            </Text>
            <Text
              className={`font-semibold leading-snug text-slate-900 dark:text-slate-50 ${
                compact ? "text-base" : "text-lg"
              }`}
              numberOfLines={compact ? 4 : undefined}
            >
              {article.title}
            </Text>
            {article.summary ? (
              <Text
                className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                numberOfLines={compact ? 3 : 3}
              >
                {article.summary}
              </Text>
            ) : null}
            <Text className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(article.publishedAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export const NewsCard = memo(NewsCardComponent);
