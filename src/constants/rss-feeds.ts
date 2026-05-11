export interface RssFeedSource {
  id: string;
  name: string;
  url: string;
  defaultCategory: string;
}

/** Curated RSS endpoints — replace if a feed URL changes. */
export const RSS_FEED_SOURCES: RssFeedSource[] = [
  {
    id: "bbc-world",
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    defaultCategory: "world",
  },
  {
    id: "cnn-top",
    name: "CNN",
    url: "http://rss.cnn.com/rss/edition.rss",
    defaultCategory: "world",
  },
  {
    id: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    defaultCategory: "technology",
  },
  {
    id: "reuters-world",
    name: "Reuters World",
    url: "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best",
    defaultCategory: "world",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    defaultCategory: "world",
  },
  {
    id: "ghanaweb",
    name: "GhanaWeb",
    url: "https://www.ghanaweb.com/GhanaHomePage/rss/news.xml",
    defaultCategory: "africa",
  },
  {
    id: "citinewsroom",
    name: "Citi Newsroom",
    url: "https://citinewsroom.com/feed/",
    defaultCategory: "africa",
  },
  {
    id: "joynews",
    name: "Joy News",
    url: "https://www.myjoyonline.com/feed/",
    defaultCategory: "africa",
  },
];
