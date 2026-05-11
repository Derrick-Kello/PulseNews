import { XMLParser } from "fast-xml-parser";

/** Normalized story extracted from RSS 2.0 or Atom feeds (Metro-safe — no Node `http`). */
export interface ParsedFeedItem {
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
  content: string | null;
  imageUrl: string | null;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: true,
});

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function firstText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (typeof node === "object" && "#text" in (node as object)) {
    const t = (node as Record<string, unknown>)["#text"];
    return t == null ? "" : String(t);
  }
  return "";
}

function parseDateSafe(raw: string): string {
  const d = Date.parse(raw);
  return Number.isFinite(d) ? new Date(d).toISOString() : new Date().toISOString();
}

function extractEnclosureImage(o: Record<string, unknown>): string | null {
  const enc = o.enclosure;
  if (!enc) return null;
  const blocks = asArray(enc as unknown);
  for (const b of blocks) {
    if (b && typeof b === "object") {
      const url = (b as Record<string, unknown>)["@_url"];
      const type = (b as Record<string, unknown>)["@_type"];
      if (typeof url === "string" && typeof type === "string" && type.startsWith("image")) return url;
    }
  }
  return null;
}

function extractMediaUrl(o: Record<string, unknown>): string | null {
  const keys = ["media:content", "media:thumbnail"] as const;
  for (const key of keys) {
    const mc = o[key];
    if (!mc) continue;
    const blocks = asArray(mc as unknown);
    for (const b of blocks) {
      if (b && typeof b === "object") {
        const url = (b as Record<string, unknown>)["@_url"];
        if (typeof url === "string" && url.length > 0) return url;
      }
    }
  }
  return null;
}

function normalizeRssItem(item: unknown): ParsedFeedItem {
  const o = item as Record<string, unknown>;
  const title = firstText(o.title);
  let link = firstText(o.link);
  if (!link) link = firstText(o.guid);
  const summary =
    firstText(o.description) ||
    firstText(o["content:encoded"]) ||
    firstText(o.content) ||
    "";
  const publishedAt = firstText(o.pubDate) || firstText(o["dc:date"]) || new Date().toISOString();
  const encoded = firstText(o["content:encoded"]) || null;
  const imageUrl = extractEnclosureImage(o) ?? extractMediaUrl(o);
  return {
    title,
    link,
    publishedAt: parseDateSafe(publishedAt),
    summary,
    content: encoded,
    imageUrl,
  };
}

function atomLinkHref(entry: Record<string, unknown>): string {
  const links = asArray(entry.link as unknown);
  let fallback = "";
  for (const l of links) {
    if (!l || typeof l !== "object") continue;
    const href = (l as Record<string, unknown>)["@_href"];
    const rel = (l as Record<string, unknown>)["@_rel"];
    if (typeof href !== "string") continue;
    if (rel === "alternate" || rel === undefined) return href;
    if (!fallback) fallback = href;
  }
  return fallback;
}

function normalizeAtomEntry(entry: unknown): ParsedFeedItem {
  const e = entry as Record<string, unknown>;
  const title = firstText(e.title);
  const link = atomLinkHref(e);
  const summary = firstText(e.summary) || firstText(e.content);
  const publishedAt =
    firstText(e.updated) || firstText(e.published) || firstText(e.created) || new Date().toISOString();
  const contentNode = e.content;
  const content =
    typeof contentNode === "object" && contentNode !== null
      ? firstText(contentNode)
      : firstText(contentNode);
  return {
    title,
    link,
    publishedAt: parseDateSafe(publishedAt),
    summary,
    content: content || null,
    imageUrl: extractMediaUrl(e),
  };
}

/** Parse RSS 2.0 or Atom XML into plain items (works in React Native / Expo). */
export function parseFeedXml(xml: string): ParsedFeedItem[] {
  let doc: unknown;
  try {
    doc = xmlParser.parse(xml);
  } catch {
    return [];
  }
  if (!doc || typeof doc !== "object") return [];

  const root = doc as Record<string, unknown>;

  if (root.rss && typeof root.rss === "object") {
    const channel = (root.rss as Record<string, unknown>).channel as Record<string, unknown> | undefined;
    if (!channel) return [];
    const items = asArray(channel.item as unknown);
    return items.map(normalizeRssItem).filter((x) => x.title.length > 0 && x.link.length > 0);
  }

  if (root.feed && typeof root.feed === "object") {
    const entries = asArray((root.feed as Record<string, unknown>).entry as unknown);
    return entries.map(normalizeAtomEntry).filter((x) => x.title.length > 0 && x.link.length > 0);
  }

  return [];
}
