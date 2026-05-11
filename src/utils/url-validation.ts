/** Returns normalized https/http URL or null if invalid. */
export function normalizeHttpUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Resolve RSS item links that are relative to the feed origin (e.g. `/post/123`). */
export function resolveArticleUrl(link: string, feedDocumentUrl: string): string | null {
  const direct = normalizeHttpUrl(link);
  if (direct) return direct;
  const trimmed = link.trim();
  if (!trimmed) return null;
  try {
    const base = new URL(feedDocumentUrl);
    return new URL(trimmed, base.origin).toString();
  } catch {
    return null;
  }
}
