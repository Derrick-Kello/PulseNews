import { getDatabase } from "@/src/database/sqlite";

export async function setFeedCache(key: string, payload: unknown): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(`INSERT OR REPLACE INTO feed_cache (id, payload, createdAt) VALUES (?, ?, ?)`, [
    key,
    JSON.stringify(payload),
    now,
  ]);
}

export async function getFeedCache<T>(key: string): Promise<T | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ payload: string }>(`SELECT payload FROM feed_cache WHERE id = ?`, [
    key,
  ]);
  if (!row?.payload) return null;
  try {
    return JSON.parse(row.payload) as T;
  } catch {
    return null;
  }
}
