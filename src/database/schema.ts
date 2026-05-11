export const SCHEMA_VERSION = 1;

export const CREATE_ARTICLES_TABLE = `
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT,
  summary TEXT,
  source TEXT,
  imageUrl TEXT,
  articleUrl TEXT,
  category TEXT,
  publishedAt TEXT,
  content TEXT,
  videoUrl TEXT,
  createdAt TEXT
);
`;

export const CREATE_BOOKMARKS_TABLE = `
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  articleId TEXT,
  savedAt TEXT
);
`;

export const CREATE_PREFERENCES_TABLE = `
CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY,
  theme TEXT,
  language TEXT,
  notifications INTEGER
);
`;

export const CREATE_VIDEOS_TABLE = `
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT,
  thumbnail TEXT,
  videoUrl TEXT,
  source TEXT,
  category TEXT,
  publishedAt TEXT
);
`;

export const CREATE_FEED_CACHE_TABLE = `
CREATE TABLE IF NOT EXISTS feed_cache (
  id TEXT PRIMARY KEY,
  payload TEXT,
  createdAt TEXT
);
`;

export const CREATE_RECENTLY_VIEWED_TABLE = `
CREATE TABLE IF NOT EXISTS recently_viewed (
  articleId TEXT PRIMARY KEY,
  viewedAt TEXT
);
`;

export const CREATE_SEARCH_HISTORY_TABLE = `
CREATE TABLE IF NOT EXISTS search_history (
  query TEXT PRIMARY KEY,
  searchedAt TEXT
);
`;

export const CREATE_INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);",
  "CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(publishedAt);",
  "CREATE INDEX IF NOT EXISTS idx_bookmarks_article ON bookmarks(articleId);",
];
