# AI-Powered News Aggregator App — MVP Prompt

# Project Overview

Build a modern React Native mobile application using Expo that centralizes news from multiple sources into one clean and intelligent platform. The application should aggregate articles and videos from NewsAPI, GNews API, and RSS feeds while supporting offline caching using SQLite.

The goal of the MVP is to create a lightweight, frontend-only news ecosystem without a custom backend.

The application should feel modern, fast, responsive, and optimized for mobile-first consumption similar to platforms like Google News, Flipboard, and TikTok-style video feeds.

---

# Core Objectives

The application should:

* Aggregate news from multiple APIs and RSS feeds
* Support video news embedding
* Cache content locally using SQLite
* Provide category-based feeds
* Support personalized news preferences
* Work partially offline
* Deliver fast performance
* Provide a clean modern UI
* Support infinite scrolling feeds
* Allow bookmarking and saving articles
* Avoid duplicate articles across multiple sources

---

# Tech Stack

## Frontend

* React Native
* Expo
* Expo Router
* TypeScript
* NativeWind (Tailwind CSS)

---

## State Management

Use:

* Zustand
* TanStack React Query

Responsibilities:

### Zustand

Handle:

* User preferences
* Theme state
* Bookmarks
* Categories
* Settings
* Cached filters

### React Query

Handle:

* API fetching
* Feed caching
* Pagination
* Background refresh
* Data synchronization

---

## Database

Use:

* expo-sqlite

The database should store:

* Cached articles
* Cached videos
* Bookmarks
* User preferences
* Feed metadata
* Recently viewed articles

---

## APIs

Use:

### News Sources

* NewsAPI
* GNews API
* RSS Feeds

### Video Sources

* YouTube embeds
* RSS video feeds

---

# Application Structure

```text
src/
│
├── app/
├── components/
├── screens/
├── hooks/
├── services/
│   ├── news/
│   ├── rss/
│   ├── videos/
│   └── database/
│
├── database/
│   ├── schema/
│   ├── queries/
│   └── sqlite.ts
│
├── store/
├── utils/
├── constants/
├── types/
└── assets/
```

---

# Required Features

# 1. Authentication

Implement lightweight authentication.

Preferred:

* Supabase Auth

Support:

* Google Authentication
* Email Authentication
* Persistent login sessions

---

# 2. Home Feed

Create a modern personalized feed.

Features:

* Infinite scroll
* Pull to refresh
* Cached feed loading
* Skeleton loaders
* Category filters
* Trending section
* Breaking news section
* Mixed-source aggregation
* Deduplication system

Feed should:

* Load cached SQLite content first
* Then fetch fresh content silently
* Update UI without full reload

---

# 3. News Categories

Support categories such as:

* Technology
* Business
* Sports
* Politics
* Entertainment
* AI
* Africa
* Local News
* Finance
* World News

Users should:

* Select favorite categories
* Customize feed ordering

---

# 4. RSS Feed Integration

Implement RSS feed aggregation using rss-parser.

The app should:

* Parse RSS XML feeds
* Convert feeds into normalized article objects
* Merge RSS content with API content
* Cache parsed results locally

Support feeds such as:

* BBC
* CNN
* TechCrunch
* Reuters
* Al Jazeera
* GhanaWeb
* Citi Newsroom
* JoyNews

---

# 5. Video News Feed

Create a vertical TikTok-style video feed.

Features:

* Auto-playing visible video
* Vertical swipe navigation
* Lazy loading videos
* YouTube embeds
* Video thumbnails
* News video categories

Use:

* react-native-youtube-iframe
* react-native-webview

The video feed should:

* Cache metadata locally
* Save recently watched videos
* Support fullscreen playback

---

# 6. Search Functionality

Implement global search.

Search should support:

* Keywords
* Topics
* Publishers
* Countries
* Categories

Features:

* Recent searches
* Search suggestions
* Debounced search input
* SQLite cached search history

---

# 7. Bookmarking System

Users should be able to:

* Save articles
* Save videos
* Remove bookmarks
* View offline saved content

Bookmarks should persist using SQLite.

---

# 8. Offline Support

Implement offline-first architecture.

Requirements:

* Load cached content immediately
* Sync new data in background
* Show offline indicator
* Cache latest articles
* Cache latest videos

The application should still display:

* Previously loaded feeds
* Saved articles
* Cached thumbnails

without internet.

---

# 9. Notifications

Use Expo Notifications.

Support:

* Breaking news alerts
* Category-specific notifications
* Daily digest notifications
* User-controlled notification settings

---

# 10. Article Screen

Create a detailed article view.

Features:

* Large article image
* Publisher information
* Article summary
* Embedded videos if available
* Share button
* Open original source button
* Related articles section
* Read time estimation

Do NOT fully scrape publisher articles.

Best practice:

* Show summary
* Open full article externally or in WebView

---

# SQLite Database Design

# Articles Table

```sql
CREATE TABLE articles (
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
```

---

# Bookmarks Table

```sql
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  articleId TEXT,
  savedAt TEXT
);
```

---

# Preferences Table

```sql
CREATE TABLE preferences (
  id INTEGER PRIMARY KEY,
  theme TEXT,
  language TEXT,
  notifications INTEGER
);
```

---

# Videos Table

```sql
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  title TEXT,
  thumbnail TEXT,
  videoUrl TEXT,
  source TEXT,
  category TEXT,
  publishedAt TEXT
);
```

---

# Feed Cache Table

```sql
CREATE TABLE feed_cache (
  id TEXT PRIMARY KEY,
  payload TEXT,
  createdAt TEXT
);
```

---

# Feed Aggregation Logic

The app should:

1. Fetch articles from NewsAPI
2. Fetch articles from GNews API
3. Fetch RSS feed articles
4. Normalize all content into one structure
5. Remove duplicates
6. Sort by publish date
7. Store in SQLite
8. Render combined feed

---

# Deduplication System

To avoid duplicate stories:

Generate a unique identifier using:

* Article URL hash
* Title similarity
* Source comparison

Before inserting into SQLite:

* Check whether article already exists

---

# UI/UX Requirements

The application should have:

* Modern glassmorphism-inspired UI
* Smooth animations
* Fast transitions
* Dark mode
* Light mode
* Bottom tab navigation
* Large news cards
* Responsive layouts
* Clean typography
* Skeleton loading states
* Swipe gestures

---

# Bottom Navigation

```text
Home
Videos
Discover
Bookmarks
Profile
```

---

# Performance Requirements

Optimize for:

* Low-end Android devices
* Fast feed rendering
* Reduced API calls
* Efficient image loading
* Infinite scrolling performance

Use:

* FlashList
* Lazy loading
* Local caching
* Memoization
* Optimized SQLite queries

---

# Security Considerations

Since this is frontend-only:

* Avoid exposing sensitive API keys publicly
* Use environment variables
* Restrict API usage limits where possible
* Rotate API keys periodically

---

# Suggested Packages

```bash
npm install zustand
npm install @tanstack/react-query
npm install expo-sqlite
npm install react-native-webview
npm install react-native-youtube-iframe
npm install rss-parser
npm install @shopify/flash-list
npm install expo-notifications
npm install expo-file-system
npm install nativewind
```

---

# MVP Goals

The MVP should successfully:

* Aggregate multiple news sources
* Render combined feeds
* Support video news playback
* Cache data locally
* Work offline partially
* Provide bookmarking
* Deliver smooth performance
* Support category filtering
* Demonstrate scalable architecture

---

# Future Upgrade Ideas

Possible future features:

* AI-generated summaries
* AI chatbot for news
* Voice narration
* Text-to-speech news mode
* Personalized recommendation engine
* Social sharing
* User comments
* Community discussions
* News credibility scoring
* Publisher subscriptions
* Trending algorithms
* Live news streaming
* Smart notifications
* AI-powered search

---

# Final Goal

The final product should become a centralized intelligent news ecosystem where users can:

* Read articles
* Watch news videos
* Discover trending stories
* Save content offline
* Personalize feeds
* Consume information quickly

all within one fast and modern mobile application.
