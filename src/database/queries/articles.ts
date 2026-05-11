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

export async function upsertArticles(articles: Article[]): Promise<void> {
  if (articles.length === 0) return;
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.withTransactionAsync(async () => {
    for (const a of articles) {
      await db.runAsync(
        `INSERT INTO articles (id, title, summary, source, imageUrl, articleUrl, category, publishedAt, content, videoUrl, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           summary = excluded.summary,
           source = excluded.source,
           imageUrl = excluded.imageUrl,
           articleUrl = excluded.articleUrl,
           category = excluded.category,
           publishedAt = excluded.publishedAt,
           content = excluded.content,
           videoUrl = excluded.videoUrl`,
        [
          a.id,
          a.title,
          a.summary,
          a.source,
          a.imageUrl,
          a.articleUrl,
          a.category,
          a.publishedAt,
          a.content,
          a.videoUrl,
          now,
        ],
      );
    }
  });
}

export async function getArticlesByCategory(category: string | null, limit = 80): Promise<Article[]> {
  const db = await getDatabase();
  const rows = category
    ? await db.getAllAsync<ArticleRow>(
        `SELECT * FROM articles WHERE category = ? ORDER BY datetime(publishedAt) DESC LIMIT ?`,
        [category, limit],
      )
    : await db.getAllAsync<ArticleRow>(
        `SELECT * FROM articles ORDER BY datetime(publishedAt) DESC LIMIT ?`,
        [limit],
      );
  return rows.map(rowToArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ArticleRow>(`SELECT * FROM articles WHERE id = ?`, [id]);
  return row ? rowToArticle(row) : null;
}

export async function recordArticleView(articleId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO recently_viewed (articleId, viewedAt) VALUES (?, ?)`,
    [articleId, now],
  );
}
