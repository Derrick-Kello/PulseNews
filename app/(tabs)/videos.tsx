import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

interface Clip {
  id: string;
  title: string;
  videoId: string;
  channel: string;
}

const PLAYLIST: Clip[] = [
  {
    id: "1",
    title: "Sample broadcast placeholder",
    videoId: "LXb3EKWsInQ",
    channel: "News demo",
  },
  {
    id: "2",
    title: "Vertical swipe demo",
    videoId: "ysz5S6PUM-U",
    channel: "News demo",
  },
];

export default function VideosScreen() {
  const { height, width } = useWindowDimensions();
  const viewHeight = Math.max(height - 140, 420);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 85 }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const idx = viewableItems[0]?.index;
      if (typeof idx === "number") setVisibleIndex(idx);
    },
    [],
  );

  const snapInterval = useMemo(() => viewHeight + 24, [viewHeight]);

  const renderItem = useCallback(
    ({ item, index }: { item: Clip; index: number }) => (
      <View style={{ height: snapInterval }} className="justify-center px-4">
        <View className="overflow-hidden rounded-[28px] border border-slate-200 bg-black shadow-xl shadow-slate-900/25 dark:border-slate-800">
          <YoutubePlayer
            height={Math.min(viewHeight - 72, 520)}
            width={width - 32}
            play={index === visibleIndex}
            videoId={item.videoId}
            webViewStyle={{ opacity: 0.99 }}
          />
          <View className="gap-1 bg-black/80 px-4 py-3">
            <Text className="text-xs uppercase tracking-wide text-blue-300">{item.channel}</Text>
            <Text className="text-lg font-semibold text-white">{item.title}</Text>
            <Text className="text-xs text-slate-300">Swipe vertically for the next briefing · audio respects mute switch</Text>
          </View>
        </View>
      </View>
    ),
    [snapInterval, viewHeight, visibleIndex, width],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["top"]}>
      <View className="border-b border-slate-800 px-4 pb-4 pt-2">
        <Text className="text-2xl font-bold text-white">Video briefings</Text>
        <Text className="text-sm text-slate-400">TikTok-style stack · swap IDs for live channels</Text>
      </View>
      <FlatList
        data={PLAYLIST}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
