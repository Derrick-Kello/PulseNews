import type { Article, ArticleRow } from "@/src/types/article";
import { getDatabase } from "@/src/database/sqlite";

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    source: row.source,
    imageUrl: row.imageUrl,
    articleUrl: row.articleUrl,
    category: row.category,
    publishedAt: row.publishedAt,
    content: row.content,
    videoUrl: row.videoUrl,
    provider: "rss",
  };
}

export async function addBookmarkForArticle(articleId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(`INSERT OR REPLACE INTO bookmarks (id, articleId, savedAt) VALUES (?, ?, ?)`, [
    articleId,
    articleId,
    now,
  ]);
}

export async function removeBookmark(articleId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM bookmarks WHERE articleId = ?`, [articleId]);
}

export async function isBookmarked(articleId: string): Promise<boolean> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) as c FROM bookmarks WHERE articleId = ?`,
    [articleId],
  );
  return (row?.c ?? 0) > 0;
}

export async function listBookmarkedArticles(): Promise<Article[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ArticleRow>(
    `SELECT a.* FROM articles a
     INNER JOIN bookmarks b ON b.articleId = a.id
     ORDER BY datetime(b.savedAt) DESC`,
  );
  return rows.map(rowToArticle);
}

export async function getAllBookmarkIds(): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ articleId: string }>(`SELECT articleId FROM bookmarks`);
  return rows.map((r) => r.articleId);
}
