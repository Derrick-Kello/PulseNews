import { Text, View } from "react-native";

interface Props {
  visible: boolean;
}

export function OfflineBanner({ visible }: Props) {
  if (!visible) return null;
  return (
    <View className="border-b border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-900 dark:bg-amber-950">
      <Text className="text-center text-xs font-medium text-amber-900 dark:text-amber-100">
        You appear offline. Showing saved and cached stories.
      </Text>
    </View>
  );
}
