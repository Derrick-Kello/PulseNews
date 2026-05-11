import { useEffect } from "react";
import { Appearance } from "react-native";

import { getPreferences } from "@/src/database/queries/preferences";
import { useThemeStore } from "@/src/store/preferences-store";

/** Hydrates theme from SQLite and applies Appearance for NativeWind / RN color scheme. */
export function ThemeBootstrap() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  useEffect(() => {
    void getPreferences().then((p) => setPreference(p.theme));
  }, [setPreference]);

  useEffect(() => {
    if (preference === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(preference);
    }
  }, [preference]);

  return null;
}
