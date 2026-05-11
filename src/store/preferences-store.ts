import { create } from "zustand";

import type { ThemePreference } from "@/src/database/queries/preferences";
import { DEFAULT_CATEGORY_IDS } from "@/src/constants/categories";

interface PreferencesState {
  favoriteCategoryIds: string[];
  feedCategorySlug: string;
  hydrated: boolean;
  setFavoriteCategoryIds: (ids: string[]) => void;
  setFeedCategorySlug: (slug: string) => void;
  hydrate: (favoriteIds: string[]) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  favoriteCategoryIds: [...DEFAULT_CATEGORY_IDS],
  feedCategorySlug: "technology",
  hydrated: false,
  setFavoriteCategoryIds: (ids) => set({ favoriteCategoryIds: ids }),
  setFeedCategorySlug: (slug) => set({ feedCategorySlug: slug }),
  hydrate: (favoriteIds) =>
    set({
      favoriteCategoryIds: favoriteIds.length ? favoriteIds : [...DEFAULT_CATEGORY_IDS],
      hydrated: true,
    }),
}));

interface ThemeState {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: "system",
  setPreference: (preference) => set({ preference }),
}));
