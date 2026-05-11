import * as Crypto from "expo-crypto";

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    u.searchParams.sort();
    return u.toString();
  } catch {
    return url.trim().toLowerCase();
  }
}

export async function stableArticleId(parts: {
  articleUrl: string;
  title: string;
  source: string;
}): Promise<string> {
  const payload = `${normalizeUrl(parts.articleUrl)}|${parts.title.trim().toLowerCase()}|${parts.source.trim().toLowerCase()}`;
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payload);
}
