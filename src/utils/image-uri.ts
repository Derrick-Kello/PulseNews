/**
 * Prepare remote image URLs for React Native / iOS (ATS) and RSS quirks.
 * - Trims whitespace
 * - Protocol-relative `//host` → `https://host`
 * - Upgrades `http://` → `https://` when possible (many CDNs serve both)
 */
export function normalizeImageUri(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  let u = raw.trim();
  if (!u) return null;

  if (u.startsWith("//")) {
    u = `https:${u}`;
  }

  if (u.startsWith("http://")) {
    u = `https://${u.slice("http://".length)}`;
  }

  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return u;
  } catch {
    return null;
  }
}
