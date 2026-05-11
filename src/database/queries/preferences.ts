import { getDatabase } from "@/src/database/sqlite";

export type ThemePreference = "light" | "dark" | "system";

export interface PreferencesRow {
  id: number;
  theme: string;
  language: string;
  notifications: number;
}

export async function getPreferences(): Promise<{
  theme: ThemePreference;
  language: string;
  notificationsEnabled: boolean;
}> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<PreferencesRow>(`SELECT * FROM preferences WHERE id = 1`);
  if (!row) {
    return { theme: "system", language: "en", notificationsEnabled: true };
  }
  return {
    theme: (row.theme as ThemePreference) ?? "system",
    language: row.language ?? "en",
    notificationsEnabled: row.notifications === 1,
  };
}

export async function savePreferences(prefs: {
  theme: ThemePreference;
  language: string;
  notificationsEnabled: boolean;
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO preferences (id, theme, language, notifications) VALUES (1, ?, ?, ?)`,
    [prefs.theme, prefs.language, prefs.notificationsEnabled ? 1 : 0],
  );
}
