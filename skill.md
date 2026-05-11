# skill.md

# AI Agent Development Rules & Standards

This document defines the mandatory engineering, architecture, UI/UX, and development standards the AI agent must follow while building this React Native Expo application.

The agent must always prioritize:

* Clean architecture
* Scalable code organization
* Native mobile UI principles
* Performance optimization
* Accessibility
* Expo best practices
* Apple Human Interface Guidelines
* Google Material Design principles
* Modern mobile UX patterns

The application must feel premium, responsive, minimal, modern, and production-ready.

---

# Core Development Principles

The AI agent must:

* Write maintainable code
* Use reusable components
* Avoid unnecessary complexity
* Follow Expo-recommended standards
* Use TypeScript strictly
* Prioritize readability
* Use modular architecture
* Avoid deeply nested components
* Avoid duplicated logic
* Use feature-based organization when possible
* Optimize rendering performance
* Prefer composition over prop drilling

---

# Mandatory Stack

The agent must use:

## Core

* React Native
* Expo
* Expo Router
* TypeScript
* NativeWind

---

## State Management

Use:

* Zustand
* TanStack React Query

Do NOT use:

* Redux unless explicitly requested
* MobX
* Context API for global complex state

---

## Database

Use:

* expo-sqlite

Do NOT use:

* Realm
* WatermelonDB
* Firebase Firestore

unless explicitly requested.

---

# Expo Best Practices

The agent must follow official Expo architecture patterns.

## Required Rules

* Use Expo Router for navigation
* Use file-based routing
* Keep routes organized and scalable
* Use Expo SDK-compatible libraries only
* Prefer Expo APIs over third-party native packages
* Avoid unnecessary native modules
* Use EAS-compatible dependencies
* Keep configuration minimal

---

## Project Structure

The application must use scalable folder organization.

```text
src/
│
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── database/
├── store/
├── constants/
├── types/
├── utils/
├── theme/
└── assets/
```

---

# TypeScript Rules

The agent must:

* Use strict TypeScript
* Avoid using any
* Define reusable types
* Use interfaces for object contracts
* Use enums for constants when appropriate
* Create centralized types folder
* Properly type API responses
* Properly type navigation params

Never:

* Ignore TypeScript errors
* Disable strict mode
* Use untyped API data

---

# UI/UX Design Standards

The UI must follow:

* Apple Human Interface Guidelines
* Google Material Design principles
* Modern mobile-first UX

The app should feel native on both iOS and Android.

---

# Apple Human Interface Principles

The agent must:

* Prioritize clarity
* Use generous spacing
* Use smooth animations
* Respect safe areas
* Use minimal visual clutter
* Use intuitive gestures
* Maintain visual hierarchy
* Use large readable typography
* Keep navigation predictable
* Use subtle depth and layering
* Use natural transitions

The interface should feel:

* Elegant
* Fluid
* Lightweight
* Native
* Calm

---

# Google Material Design Principles

The agent must:

* Use meaningful motion
* Maintain consistent elevation
* Use responsive layouts
* Provide proper feedback states
* Use touch-friendly interactions
* Maintain consistent spacing systems
* Ensure accessibility compliance
* Use adaptive components
* Use intuitive navigation patterns

---

# UI Component Standards

All components must:

* Be reusable
* Be responsive
* Support dark mode
* Support light mode
* Use proper spacing
* Handle loading states
* Handle empty states
* Handle error states
* Be accessibility-friendly

---

# Design System Rules

The agent must create a centralized design system.

## Include

* Colors
* Typography
* Spacing
* Radius
* Shadows
* Icons
* Animations
* Theme tokens

---

# Color System

The UI should use:

* Neutral backgrounds
* High contrast text
* Accessible color combinations
* Minimal accent colors
* Consistent semantic colors

Avoid:

* Oversaturated colors
* Random color usage
* Inconsistent themes

---

# Typography Standards

Use:

* Clear font hierarchy
* Large readable titles
* Medium-weight body text
* Proper line height
* Consistent font scaling

Typography should feel:

* Clean
* Modern
* Mobile-optimized
* Easy to scan

---

# Spacing System

Use consistent spacing scale.

Example:

```text
4
8
12
16
20
24
32
40
48
```

Avoid inconsistent spacing.

---

# Animation Standards

Animations must:

* Feel smooth
* Be subtle
* Improve usability
* Never block interaction
* Use native performance-driven animations

Preferred:

* Reanimated
* Gesture Handler

Use animations for:

* Screen transitions
* Feed interactions
* Loading states
* Bottom sheets
* Video interactions
* Card interactions

Avoid:

* Excessive animations
* Slow transitions
* Distracting motion

---

# Performance Rules

The agent must optimize performance aggressively.

## Required

* Use FlashList instead of FlatList for large feeds
* Memoize expensive components
* Use lazy loading
* Optimize images
* Cache API responses
* Avoid unnecessary re-renders
* Use SQLite caching
* Use pagination
* Optimize navigation transitions

---

# Feed Rendering Rules

For large feeds:

* Use virtualization
* Use FlashList
* Lazy load images
* Render skeleton loaders
* Paginate API requests
* Avoid rendering heavy nested components

---

# Networking Standards

The app must:

* Use React Query for API management
* Cache API responses
* Handle offline states
* Retry failed requests gracefully
* Show user-friendly error messages
* Support pull-to-refresh

---

# Offline-First Principles

The app must:

* Load SQLite cache first
* Sync in background
* Work partially offline
* Store latest feeds locally
* Store bookmarks locally
* Avoid blank screens without internet

---

# SQLite Standards

The agent must:

* Normalize database schema
* Create reusable query helpers
* Avoid duplicate inserts
* Index important columns
* Handle migrations safely
* Keep queries optimized

---

# Accessibility Standards

The application must:

* Support screen readers
* Use accessible touch targets
* Maintain color contrast ratios
* Use readable typography
* Support dynamic text scaling
* Use semantic accessibility labels

---

# Dark Mode Requirements

The application must fully support:

* Dark mode
* Light mode
* System theme detection

Dark mode should:

* Reduce eye strain
* Preserve contrast
* Maintain readability

---

# Navigation Standards

Use:

* Bottom tab navigation
* Predictable routing
* Gesture-friendly navigation
* Smooth transitions

Navigation should:

* Feel native
* Be intuitive
* Avoid deep nesting

---

# Component Architecture

Each feature should:

* Be modular
* Be isolated
* Have reusable hooks
* Separate UI from business logic

---

# Custom Hooks Rules

The agent should:

* Extract reusable logic into hooks
* Keep hooks focused
* Avoid massive hooks
* Use hooks for:

  * API fetching
  * pagination
  * caching
  * video controls
  * theme handling
  * SQLite operations

---

# Error Handling Standards

The application must:

* Never crash silently
* Show friendly error states
* Handle API failures gracefully
* Handle offline states properly
* Provide retry options

---

# Security Rules

The agent must:

* Avoid exposing secrets directly
* Use environment variables
* Avoid storing sensitive data insecurely
* Validate external API responses
* Sanitize dynamic content

---

# Video Feed Standards

The video feed should:

* Feel smooth like TikTok/Reels
* Auto-play visible content only
* Pause hidden videos
* Lazy load videos
* Optimize memory usage
* Use gesture-friendly interactions

---

# Loading State Standards

Always provide:

* Skeleton loaders
* Empty states
* Retry states
* Progressive loading

Never show:

* blank white screens
* frozen loading states

---

# Code Quality Rules

The agent must:

* Keep files reasonably small
* Separate concerns properly
* Use meaningful naming conventions
* Avoid magic numbers
* Use constants where appropriate
* Avoid deeply nested conditionals

---

# Naming Conventions

Use:

## Components

PascalCase

Example:

```text
NewsCard.tsx
VideoFeed.tsx
```

---

## Hooks

camelCase prefixed with use

Example:

```text
useNewsFeed.ts
useBookmarks.ts
```

---

## Constants

UPPER_SNAKE_CASE

Example:

```text
MAX_FEED_ITEMS
DEFAULT_CACHE_DURATION
```

---

# Styling Rules

The agent must:

* Use NativeWind utilities primarily
* Avoid inline styles when possible
* Create reusable style patterns
* Use consistent spacing utilities
* Keep UI visually balanced

---

# API Layer Standards

The API layer must:

* Be centralized
* Be modular
* Normalize response structures
* Handle errors consistently
* Support caching
* Support pagination

---

# News Aggregation Rules

The app should:

* Merge multiple feeds cleanly
* Deduplicate articles
* Sort chronologically
* Cache aggressively
* Support background refresh

---

# Final Product Expectations

The final application should feel:

* Premium
* Fast
* Native
* Smooth
* Minimal
* Intelligent
* Modern
* Highly scalable

The experience should resemble the quality standards of:

* Apple News
* Google News
* Flipboard
* Medium
* TikTok
* Notion

while maintaining excellent engineering architecture and Expo best practices.
