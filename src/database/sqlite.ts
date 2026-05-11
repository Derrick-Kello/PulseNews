import * as SQLite from "expo-sqlite";

import {
  CREATE_ARTICLES_TABLE,
  CREATE_BOOKMARKS_TABLE,
  CREATE_FEED_CACHE_TABLE,
  CREATE_INDEXES,
  CREATE_PREFERENCES_TABLE,
  CREATE_RECENTLY_VIEWED_TABLE,
  CREATE_SEARCH_HISTORY_TABLE,
  CREATE_VIDEOS_TABLE,
} from "@/src/database/schema";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("news_aggregator.db").then(async (db) => {
      await migrate(db);
      return db;
    });
  }
  return dbPromise;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ${CREATE_ARTICLES_TABLE}
    ${CREATE_BOOKMARKS_TABLE}
    ${CREATE_PREFERENCES_TABLE}
    ${CREATE_VIDEOS_TABLE}
    ${CREATE_FEED_CACHE_TABLE}
    ${CREATE_RECENTLY_VIEWED_TABLE}
    ${CREATE_SEARCH_HISTORY_TABLE}
  `);
  for (const stmt of CREATE_INDEXES) {
    await db.execAsync(stmt);
  }
}
