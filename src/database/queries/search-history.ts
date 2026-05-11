import { getDatabase } from "@/src/database/sqlite";

const MAX_HISTORY = 20;

export async function addSearchQuery(query: string): Promise<void> {
  const trimmed = query.trim();
  if (!trimmed) return;
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(`INSERT OR REPLACE INTO search_history (query, searchedAt) VALUES (?, ?)`, [
    trimmed,
    now,
  ]);
}

export async function recentSearchQueries(limit = 10): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ query: string }>(
    `SELECT query FROM search_history ORDER BY datetime(searchedAt) DESC LIMIT ?`,
    [limit],
  );
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of rows) {
    if (seen.has(r.query)) continue;
    seen.add(r.query);
    out.push(r.query);
    if (out.length >= MAX_HISTORY) break;
  }
  return out;
}
