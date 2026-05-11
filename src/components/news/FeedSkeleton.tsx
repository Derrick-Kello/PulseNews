import { View } from "react-native";

interface Props {
  count?: number;
}

export function FeedSkeleton({ count = 6 }: Props) {
  return (
    <View className="gap-4 px-4 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/60 dark:border-slate-700/70 dark:bg-slate-900/50">
          <View className="h-40 w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
          <View className="gap-3 p-4">
            <View className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
            <View className="h-5 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            <View className="h-5 w-[92%] rounded-md bg-slate-200 dark:bg-slate-700" />
            <View className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
          </View>
        </View>
      ))}
    </View>
  );
}
