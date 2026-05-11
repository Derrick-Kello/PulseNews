import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, useColorScheme, View } from "react-native";

interface GlassIconButtonProps {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
}

/**
 * Circular glass-style control for overlays on photos (blur on native, translucent on web).
 */
export function GlassIconButton({ onPress, children, accessibilityLabel }: GlassIconButtonProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  if (Platform.OS === "web") {
    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.webCapsule,
          {
            backgroundColor: isDark ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.38)",
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <BlurView intensity={55} tint={isDark ? "dark" : "light"} style={styles.blurCapsule}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  blurCapsule: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.35)",
  },
  inner: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  webCapsule: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.35)",
  },
});
