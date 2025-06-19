# Technical Implementation Guide

This document is a **deep-dive reference** to the codebase.  It complements the high-level `README.md` by answering _how_ each part is built and how to extend or debug it.

---

## Recent UI & CSS Changes (2025)

### Carousel (Featured & Latest Posts)
- Carousels on the homepage use a flexbox horizontal scroll layout.
- **Cards are fully clickable**: The `PostCard` component is passed a `class="carousel-card"` prop and is not wrapped in an extra div that could block pointer events.
- **Drag vs. Click**: Dragging the carousel (mouse/touch) is detected and disables pointer events on cards only during drag. Clicks on cards always work unless the user is actively dragging.
- **Navigation dots**: Each post has a corresponding dot, numbered for clarity. Dots are styled for accessibility in both light and dark mode.
- **CSS pointer-events**: `.carousel-card-container` uses `pointer-events: none;` and `.carousel-card` uses `pointer-events: auto;` to ensure only the card is interactive.

### Dark Mode Link Styling
- All links in `.prose` content are styled to be light blue or white in dark mode for readability.
- Social media icon links are NOT forcibly colored in dark mode, so their brand/icon colors remain visible.
- The current CSS for dark mode links is:
  ```css
  .dark .prose a {
    color: rgb(248, 254, 255) !important;
  }
  .dark .prose a:hover {
    color: rgb(255, 255, 255) !important;
  }
  ```
  If you need to exclude specific links from this, add a unique class and override as needed.

### Image Handling & Zoom Implementation

- **Context-Aware Resolution Management**:
  - **320px** - Home page post card thumbnails use 320px resolution for faster initial page loading
  - **640px** - Blog post content images (both hero and in-content) are standardized to 640px resolution by default
  - **960px** - Images switch to higher resolution when zoomed for detailed viewing
  - Resolution selection is implemented in the `ResponsiveImage.astro` component via the `getOptimalSize()` function
  - Post cards with width <= 400px automatically receive 320px images for improved performance
  
- **Format Optimization**:
  - **WebP Prioritization** - WebP format is automatically used for zoomed images when available
  - **Fallback Chain** - If WebP load fails, system tries high-res version in original format
  - **Final Fallback** - If both high-resolution versions fail, original image is displayed

- **Custom Image Zoom Modal**:
  - A lightweight custom modal implementation in `PostLayout.astro` replaces the previous FSLightbox dependency
  - Modal is generated via pure JavaScript and dynamically injected into the DOM
  - Loading spinner provides visual feedback during high-res image loading
  - Close button and click-outside behavior for intuitive UX

- **Performance Optimizations**:
  - **Client-side Caching** - An in-memory `imageCache` Map prevents duplicate network requests
  - **Format Selection** - WebP is preferentially loaded (vs JPG/PNG) for better quality and smaller file sizes
  - **Lazy Path Calculation** - High-res paths are generated only when needed
  - **Console Logging** - Diagnostic output helps track image loading failures with fallback reporting

- **Technical Implementation Details**:
  - `data-zoom-processed` attribute prevents duplicate event handlers on images
  - `data-highres-src` attribute pre-computes and stores proper high-resolution image paths
  - Base path extraction separates filename from resolution and extension for better format handling
  - CSS transitions provide smooth visual experience during image transitions
  - Native `click` events and event delegation for performance

---

---

## 1  Tech-Stack Overview

| Layer | Library / Tool | Notes |
|-------|----------------|-------|
| Static-Site Generator | [Astro](https://astro.build/) | Island-architecture; outputs pure HTML/JS for excellent performance |
| Language | TypeScript | Strict typing across server and client code |
| Styling | Tailwind CSS | JIT build via `tailwind.config.mjs` |
| UI Components | `.astro` & `.jsx` | Astro islands; React used only where interactivity is required |
| Data | Markdown / MDX | Posts live in `src/content/posts/` |
| Images | [sharp](https://sharp.pixelplumbing.com/) (via `npm run optimize-images`) | Generates responsive images & placeholders |
| Tooling | ESLint, Prettier, Husky | Enforced through Git hooks (not shown here) |

---

## 2  Directory Structure (abridged)

```
├── public/                # Static assets copied verbatim
├── src/
│   ├── components/        # UI & layout islands (.astro / .jsx)
│   │   ├── layout/        # Header / Footer
│   │   └── ui/            # Logo, Nav, SocialLinks
│   ├── config/            # Strongly-typed blog configuration system
│   │   ├── blog-template.ts        # Master template + interfaces
│   │   ├── current-config.ts       # The **active** config (exported as BLOG_CONFIG)
│   │   └── templates/              # Presets – finance, tech, lifestyle, …
│   ├── content/
│   │   └── posts/          # Markdown/MDX articles (collection: 'posts')
│   ├── lib/               # Pure, framework-agnostic utilities
│   │   ├── content/       # Queries, search, related logic
│   │   ├── images/        # Responsive image helpers
│   │   ├── pagination/    # Pagination helpers
│   │   └── seo/           # SEO helpers (OG meta, structured data)
│   ├── pages/             # Astro route definitions
│   └── types/             # Shared TS types (content, globals)
└── tailwind.config.mjs    # Design tokens & theme hooks
```

> A complete `tree` print-out is available by running `npm run docs:tree` (scripts/example).

---

## 3  Configuration System (`src/config`)

### 3.1 blog-template.ts

Main **schema & helpers** – _no runtime side-effects_.

*Key exports*

| Symbol | Type | Purpose |
|--------|------|---------|
| `BlogConfig` | `interface` | Canonical shape the `current-config.ts` must match |
| `THEME_PRESETS` | `const` | Colour-scale presets (`blue`, `green`, `purple`, `orange`) |
| `NICHE_PRESETS` | `const` | Common category/tag/navigation presets |
| `createTheme(colors)` | `function` | Returns Tailwind-compatible colour tokens |
| `createNavigation(items)` | `function` | Normalises nested nav tree |

All complex nested objects (branding, layout, content, features, legalPages …) are modelled with dedicated interfaces (see file for the full list).

### 3.2 current-config.ts

Exports **`BLOG_CONFIG`** (and `getCurrentConfig`, `getThemeColors`).  This is the single-source-of-truth consumed by utilities and components at build-time.

### 3.3 templates/*.ts

Preset `BlogConfig` objects.  Copy one to `current-config.ts` to switch niche.

---

## 4  Type Definitions (`src/types`)

| File | Highlights |
|------|------------|
| `content.ts` | `BlogPost`, `BlogPostData`, `PaginationResult<T>`, UI prop interfaces (`PostLayoutProps` etc.) |
| `global.d.ts` | Ambient types re-exporting `astro:content` helpers (`getCollection<T>` …) |

---

## 5  Utility Modules (`src/lib`)

Below tables list **exported functions**, their **signatures** and **return types**.  Line numbers refer to the source for quick lookup.

### 5.1 Content Queries – `content/queries.ts`

| Function | Signature | Returns |
|----------|-----------|---------|
| `getAllPosts()` | `(): Promise<BlogPost[]>` | All posts sorted newest-first |
| `getFeaturedPosts(limit?)` | `(limit:number=3): Promise<BlogPost[]>` | Featured + latest fallback |
| `getLatestPosts(limit?, excludeIds?)` | `(limit:number=3, excludeIds:string[]): Promise<BlogPost[]>` | Latest posts excluding specified |
| `getPostsByCategory(category)` | `(category:string): Promise<BlogPost[]>` | Posts whose `data.category` matches |
| `getPostsByTag(tag)` | `(tag:string): Promise<BlogPost[]>` | Posts containing tag |
| `getPostsByYear()` | `(): Promise<PostsByYear>` | Map of year ⇒ posts |
| `getCategoryStats()` | `(): Promise<CategoryStats[]>` | Count + latest for each category |
| `getTagStats()` | `(): Promise<TagStats[]>` | Count + post list for each tag |
| `getRelatedPosts(currentPost, limit?)` | `(currentPost:BlogPost, limit:number=3): Promise<BlogPost[]>` | Heuristic relevance (category>tags>slug) |

### 5.2 Search – Static JSON Index

| Part | File | Purpose |
|------|------|---------|
| Backend helper | `lib/content/search.ts` | Pure functions `searchPosts` / `searchPostsWithScore` used for text-matching and scoring. |
| Build-time endpoint | `pages/search-index.json.ts` | Runs **once at build** to emit `/search-index.json` – a lightweight array of `{slug,title,excerpt,tags,category,date}`. Completely static, no server needed. |
| Front-end island | `components/ui/SearchBar.jsx` | Fetches the JSON index on first interaction, filters client-side and shows dropdown/overlay. Responsive: full input ≥ lg breakpoint, magnifier icon + modal below. |

Algorithm: simple contains-matching; for large blogs swap in Fuse.js without touching the endpoint.

### 5.3 Related Content – `content/related.ts`

This module previously exposed extra helpers for suggested content.
The current codebase only keeps the main `getRelatedPosts` function;
other helpers were removed during cleanup.

### 5.4 Pagination – `pagination/index.ts`

| Function | Signature | Returns |
|----------|-----------|---------|
| `paginate<T>(items, currentPage?, itemsPerPage?)` | `(items:T[], currentPage:number=1, itemsPerPage:number): PaginationResult<T>` | Slice + meta |
| `generatePaginationPaths<T>(items, itemsPerPage?, basePath?)` | `(items:T[], itemsPerPage:number, basePath:string): {params, props}[]` | Astro static paths |
| `generatePageNumbers(current, total, maxVisible?)` | `(current:number, total:number, maxVisible:number=5): number[]` | Sequence for UI pager |

### 5.5 SEO – `seo/index.ts`

| Function | Signature | Purpose |
|----------|-----------|---------|
| `generateOgImageUrl(title, image?)` | `(title:string, image?:string): string` | Placeholder OG image svc |
| `generatePostUrl(slug)` | `(slug:string): string` | Full canonical post URL |
| `generateCategoryUrl(category)` | `(category:string): string` | Category page URL |
| `generateTagUrl(tag)` | `(tag:string): string` | Tag page URL |
| `generatePostStructuredData(post, url)` | `(post:BlogPost, url:string): object` | JSON-LD schema |
| `generateMetaDescription(excerpt, maxLen?)` | `(excerpt:string, maxLen:number=160): string` |
| `generatePageTitle(title, includeSiteName?)` | `(title:string, includesSiteName:boolean=true): string` |
| `extractKeywords(post)` | `(post:BlogPost): string[]` | Simple keyword extraction |

### 5.6 Images – `images/index.ts`

| Function | Signature |
|----------|-----------|
| `generatePlaceholderImage(url?, width?, height?)` | Returns low-quality blurred placeholder |
| `getResponsiveImageSizes(maxWidth?)` | Returns `sizes` attribute string |
| `extractImageDimensions(url)` | Extracts width/height from filename (`w`×`h`) |
| `isPlaceholderImage(url)` | Boolean check |
| `generateImageSrcSet(url, widths[])` | Responsive `srcset` string |
| `getImageLoadingStrategy(maxWidth?)` | `"lazy" | "eager"` |
| `generateImageAlt(filename, fallback?)` | Smart filename-to-alt conversion |

---

## 6  Components (`src/components`)

| Component | Type | Purpose / Key Props |
|-----------|------|---------------------|
| `layout/ConfigurableHeader.astro` | Astro | Renders nav from `BLOG_CONFIG.navigation.header` |
| `layout/ConfigurableFooter.astro` | Astro | Renders footer sections & legal links |
| `ui/Logo.astro` | Astro | Brand logo; auto-switches light/dark images |
| `ui/Navigation.astro` | Astro | Recursive nav tree |
| `ui/SocialLinks.astro` | Astro | Icon list from `BLOG_CONFIG.social` (top-level array) |
| `AuthorBio.astro` | Astro | Post author card (uses `BlogPostData.author`) |
| `FormattedDate.astro` | Astro | `<time>` wrapper with locale formatting |
| `NewsletterSignup.astro` | Astro | Integrates with Mailchimp (configurable URL) |
| `PageNavigation.astro` | Astro | Prev/Next post links |
| `PostCard.astro` | Astro | Summary card for grids |
| `RelatedPosts.astro` | Astro | Calls `getRelatedPosts` utility |
| `ResponsiveImage.astro` | Astro | `<picture>` wrapper around `images/index` |
| `Quiz.jsx` | React Island | Interactive multiple-choice quiz (uses local state) |
| `ReadingProgress.jsx` | React Island | Scroll progress bar |
| `ShareButtons.jsx` | React Island | Social share pop-ups |
| `TableOfContents.jsx` | React Island | Dynamic heading tracker |
| `SearchBar.jsx` | React Island | Responsive header search (uses static index) |

> **Astro Island pattern** – `.jsx` files are only hydrated client-side where needed, ensuring minimal JS payload.

---

## 7  Routing (`src/pages`)

Each `.astro` file under `pages/` becomes an output HTML route; dynamic routes (`[slug].astro`, `[page].astro`) are backed by utilities above for static path generation.

Key pages:

* `index.astro` – Home; fetches `getFeaturedPosts` + `getLatestPosts`
* `posts/[slug].astro` – Post template; loads Markdown content and related posts
* `categories/[category]/page/[page].astro` – Category listing with pagination
* `tags/[tag]/page/[page].astro` – Tag listing with pagination

---

## 8  Build & Deployment

1. `npm run build` ⇒ `astro build` ⇒ static HTML in `dist/`
2. Optional `npm run optimize-images` transforms images via **sharp** (requires `sudo` on some Linux setups due to native binaries).
3. Deploy `dist/` to the CDN/platform of your choice (Vercel, Netlify, Cloudflare…).

---

## 9  Extensibility Notes

* Add a new niche by exporting a `BlogConfig` object in `src/config/templates/`.
* Use `lib/content/index.ts` as reference for writing further data helpers.
* UI components intentionally avoid framework-specific code – they accept plain props and are easily replaced.
* Strong typing means most breaking changes will surface at compile-time.

---

_© 2025 Blog CMS_

