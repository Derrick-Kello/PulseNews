export interface CategoryDefinition {
  id: string;
  label: string;
  /** NewsAPI / GNews topic slug where applicable */
  slug: string;
}

export const NEWS_CATEGORIES: CategoryDefinition[] = [
  { id: "technology", label: "Technology", slug: "technology" },
  { id: "business", label: "Business", slug: "business" },
  { id: "sports", label: "Sports", slug: "sports" },
  { id: "politics", label: "Politics", slug: "politics" },
  { id: "entertainment", label: "Entertainment", slug: "entertainment" },
  { id: "ai", label: "AI", slug: "technology" },
  { id: "africa", label: "Africa", slug: "world" },
  { id: "local", label: "Local News", slug: "general" },
  { id: "finance", label: "Finance", slug: "business" },
  { id: "world", label: "World News", slug: "world" },
];

export const DEFAULT_CATEGORY_IDS = ["technology", "business", "world"];
