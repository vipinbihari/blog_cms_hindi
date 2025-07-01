# FinHux Blog CMS - Comprehensive Codebase Documentation

> **Generated:** 2025-07-01  
> **Purpose:** Single source of truth for understanding the complete codebase functionality  
> **Note:** This documentation is based on actual source code analysis, not outdated docs

---

## Table of Contents

1. [Configuration System](#configuration-system)
2. [Content Management](#content-management)
3. [Utility Libraries](#utility-libraries)
4. [PWA System](#pwa-system)
5. [SEO Utilities](#seo-utilities)
6. [Type Definitions](#type-definitions)
7. [Astro Components](#astro-components)
8. [Layout Components](#layout-components)
9. [Page Routes](#page-routes)
10. [API Endpoints](#api-endpoints)
11. [Scripts and Build Tools](#scripts-and-build-tools)
12. [Configuration Files](#configuration-files)

---

## Configuration System

### `/src/config/blog-template.ts`
**Purpose:** Core TypeScript interfaces and theme presets for the blog configuration system. Contains no live data, only type definitions.

#### Key Interfaces:
- **`HeroConfig`** - Hero section configuration
  - `title?: string`
  - `subtitle?: string`
  - `ctaButton1?: HeroCtaButton`
  - `ctaButton2?: HeroCtaButton`
  - `image?: HeroConfigImage`
  - `showImage?: boolean`
  - `heroBackgroundImage?: string | HeroBackgroundImage`

- **`BlogConfig`** - Main blog configuration interface
  - `site: SiteConfig` - Site identity and metadata
  - `theme: ThemeConfig` - Color schemes and styling
  - `layout: LayoutConfig` - Layout and display settings
  - `navigation: NavigationConfig` - Header/footer navigation
  - `branding: BrandingConfig` - Logos and visual identity
  - `contact?: ContactPageConfig` - Contact page configuration
  - `about?: AboutPageConfig` - About page configuration
  - `upstoxCTA?: UpstoxCTAConfig` - Upstox integration
  - `pwa?: PWAConfig` - Progressive Web App settings
  - `legalPages?: LegalPagesConfig` - Legal pages content

- **`PWAConfig`** - Progressive Web App configuration
  - `enabled: boolean`
  - `name: string`
  - `shortName: string`
  - `description: string`
  - `themeColor?: string`
  - `backgroundColor?: string`
  - `display: 'minimal-ui' | 'standalone' | 'fullscreen' | 'browser'`
  - `icons: IconConfig[] | 'auto'`
  - `shortcuts?: ShortcutConfig[] | 'auto'`

#### Theme Presets:
- **`THEME_PRESETS`** - Pre-built color schemes
  - `teal` - Teal-based color palette
  - `blue` - Blue-based color palette  
  - `green` - Green-based color palette
  - `purple` - Purple-based color palette
  - `orange` - Orange-based color palette

### `/src/config/current-config.ts`
**Purpose:** Active configuration file containing live data for the current blog instance (FinHux).

#### Exported Functions:
- **`getCurrentConfig()`**
  - **Args:** None
  - **Returns:** `BlogConfig`
  - **Purpose:** Get the current active blog configuration

- **`getThemeColors()`**
  - **Args:** None
  - **Returns:** `ColorScale`
  - **Purpose:** Get the current theme's color palette

#### Configuration Sections:
- Site configuration (name, URL, description)
- Theme settings (green preset)
- Layout preferences (posts per page, sidebar settings)
- Navigation structure (header links, footer sections)
- Branding assets (logos, favicons)
- PWA settings (with auto-generated icons and shortcuts)
- Legal pages content (privacy policy, terms, disclaimer)

---

## Content Management

### `/src/lib/content/queries.ts`
**Purpose:** Core content querying and filtering functions for blog posts.

#### Functions:

- **`getAllPosts()`**
  - **Args:** None
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Get all blog posts sorted by date (newest first)

- **`getFeaturedPosts(limit?: number)`**
  - **Args:** `limit: number = BLOG_CONFIG.layout.featuredPostsCount ?? 3`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Get posts explicitly marked as featured

- **`getLatestPosts(limit?: number, excludeIds?: string[])`**
  - **Args:** `limit: number = 3`, `excludeIds: string[] = []`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Get latest posts, excluding specified IDs

- **`getPostsByCategory(category: string)`**
  - **Args:** `category: string`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Filter posts by category slug

- **`getPostsByTag(tag: string)`**
  - **Args:** `tag: string`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Filter posts by tag slug

- **`getPostsByYear()`**
  - **Args:** None
  - **Returns:** `Promise<PostsByYear>`
  - **Purpose:** Group posts by year for archive views

- **`getCategoryStats()`**
  - **Args:** None
  - **Returns:** `Promise<CategoryStats[]>`
  - **Purpose:** Get all categories with post counts and latest post

- **`getTagStats()`**
  - **Args:** None
  - **Returns:** `Promise<TagStats[]>`
  - **Purpose:** Get all tags with post counts

- **`getRelatedPosts(currentPost: BlogPost, limit?: number)`**
  - **Args:** `currentPost: BlogPost`, `limit: number = BLOG_CONFIG.layout.relatedPostsCount ?? 3`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Find related posts based on category, tags, and slug keywords

- **`getSlugKeywords(slug: string)`**
  - **Args:** `slug: string`
  - **Returns:** `string[]`
  - **Purpose:** Extract and normalize keywords from a slug string

#### Helper Functions:
- **`compareDesc(dateA: Date, dateB: Date)`**
  - **Args:** `dateA: Date`, `dateB: Date`
  - **Returns:** `number`
  - **Purpose:** Compare dates in descending order (newest first)

### `/src/lib/content/search.ts`
**Purpose:** Search functionality for blog posts with scoring and suggestions.

#### Functions:

- **`searchPosts(query: string)`**
  - **Args:** `query: string`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Simple text search across post titles, excerpts, tags, categories, and authors

- **`searchPostsWithScore(query: string)`**
  - **Args:** `query: string`
  - **Returns:** `Promise<SearchResult[]>`
  - **Purpose:** Advanced search with relevance scoring and match highlighting

- **`getSearchSuggestions(query: string, limit?: number)`**
  - **Args:** `query: string`, `limit: number = 5`
  - **Returns:** `Promise<string[]>`
  - **Purpose:** Get search suggestions based on partial query

### `/src/lib/content/related.ts`
**Purpose:** Legacy related posts functionality (replaced by getRelatedPosts in queries.ts).

#### Functions:

- **`getRelatedPostsLegacy(currentPost: BlogPost, limit?: number)`**
  - **Args:** `currentPost: BlogPost`, `limit: number = 3`
  - **Returns:** `Promise<BlogPost[]>`
  - **Purpose:** Legacy related posts logic (deprecated)

---

## Utility Libraries

### `/src/lib/slugify.ts`
**Purpose:** URL-safe slug generation utilities.

#### Functions:

- **`slugifyTag(value: string)`**
  - **Args:** `value: string`
  - **Returns:** `string`
  - **Purpose:** Creates URL-safe slug by converting to lowercase, replacing special characters with hyphens, and cleaning up multiple hyphens

### `/src/lib/imagePathResolver.ts`
**Purpose:** Image path resolution between content repository and public URLs.

#### Functions:

- **`resolveContentImagePath(path: string)`**
  - **Args:** `path: string` - Path to image in content repository
  - **Returns:** `string` - Public URL path for the image
  - **Purpose:** Converts content repository paths to public URLs (e.g., `content/uploads/image.jpg` → `/images/uploads/image.jpg`)

- **`getOptimizedImagePath(src: string, width: number)`**
  - **Args:** `src: string` - Source image path, `width: number` - Target width
  - **Returns:** `string` - Optimized image path
  - **Purpose:** Generate optimized image path for different display sizes

### `/src/lib/pagination/index.ts`
**Purpose:** Pagination utilities for post listings and static site generation.

#### Functions:

- **`paginate<T>(items: T[], currentPage?: number, itemsPerPage?: number)`**
  - **Args:** `items: T[]`, `currentPage: number = 1`, `itemsPerPage: number = BLOG_CONFIG.layout.postPerPage`
  - **Returns:** `PaginationResult<T>`
  - **Purpose:** Paginate array of items with metadata

- **`generatePaginationPaths<T>(items: T[], itemsPerPage?: number, basePath?: string)`**
  - **Args:** `items: T[]`, `itemsPerPage: number = BLOG_CONFIG.layout.postPerPage`, `basePath: string = '/posts/page'`
  - **Returns:** `Array<{params: {page: string}, props: PaginationProps}>`
  - **Purpose:** Generate Astro static paths for paginated routes

- **`generatePageNumbers(currentPage: number, totalPages: number, maxVisible?: number)`**
  - **Args:** `currentPage: number`, `totalPages: number`, `maxVisible: number = 5`
  - **Returns:** `number[]`
  - **Purpose:** Generate page numbers for pagination display with ellipsis logic

### `/src/lib/index.ts`
**Purpose:** Main library barrel file that re-exports all utilities.

#### Exports:
- All content utilities (`./content`)
- All SEO utilities (`./seo`)
- All image utilities (`./images`)
- All pagination utilities (`./pagination`)
- Common types from `../types/content`
- Blog configuration from `../config/current-config`

---

## PWA System

### `/src/lib/pwa/manifest.ts`
**Purpose:** Progressive Web App manifest generation utilities.

#### Interfaces:

- **`WebAppManifest`** - Complete PWA manifest structure
  - Standard manifest fields (name, description, icons, etc.)
  - Extended fields (shortcuts, screenshots, categories)

#### Functions:

- **`generateManifest(config: BlogConfig)`**
  - **Args:** `config: BlogConfig`
  - **Returns:** `WebAppManifest`
  - **Purpose:** Generate complete web app manifest from blog configuration

- **`generateDefaultShortcuts(config: BlogConfig)`**
  - **Args:** `config: BlogConfig`
  - **Returns:** `WebAppManifest['shortcuts']`
  - **Purpose:** Generate default PWA shortcuts from navigation configuration

- **`generateDefaultIcons(config: BlogConfig)`**
  - **Args:** `config: BlogConfig`
  - **Returns:** `WebAppManifest['icons']`
  - **Purpose:** Generate default PWA icons from site logo configuration

- **`validatePWAConfig(config: BlogConfig)`**
  - **Args:** `config: BlogConfig`
  - **Returns:** `string[]` - Array of validation errors
  - **Purpose:** Validate PWA configuration for common issues

- **`isPWAEnabled(config: BlogConfig)`**
  - **Args:** `config: BlogConfig`
  - **Returns:** `boolean`
  - **Purpose:** Check if PWA is enabled and properly configured

---

## SEO Utilities

### `/src/lib/seo/index.ts`
**Purpose:** SEO-related utilities for meta tags, structured data, and URL generation.

#### Functions:

- **`generateOgImageUrl(title: string, image?: string)`**
  - **Args:** `title: string`, `image?: string`
  - **Returns:** `string`
  - **Purpose:** Generate Open Graph image URL with fallback to placeholder

- **`generatePostUrl(slug: string)`**
  - **Args:** `slug: string`
  - **Returns:** `string`
  - **Purpose:** Generate canonical URL for blog post

- **`generateCategoryUrl(category: string)`**
  - **Args:** `category: string`
  - **Returns:** `string`
  - **Purpose:** Generate URL for category page

- **`generateTagUrl(tag: string)`**
  - **Args:** `tag: string`
  - **Returns:** `string`
  - **Purpose:** Generate URL for tag page

- **`generatePostStructuredData(post: BlogPost, url: string)`**
  - **Args:** `post: BlogPost`, `url: string`
  - **Returns:** `Object` - JSON-LD structured data
  - **Purpose:** Create structured data markup for blog posts

- **`generateMetaDescription(excerpt: string, maxLength?: number)`**
  - **Args:** `excerpt: string`, `maxLength: number = 160`
  - **Returns:** `string`
  - **Purpose:** Generate SEO-optimized meta description from excerpt

- **`generatePageTitle(title: string, includesSiteName?: boolean)`**
  - **Args:** `title: string`, `includesSiteName: boolean = true`
  - **Returns:** `string`
  - **Purpose:** Generate page title with optional site name suffix

- **`extractKeywords(post: BlogPost)`**
  - **Args:** `post: BlogPost`
  - **Returns:** `string[]`
  - **Purpose:** Extract keywords from post content for SEO

- **`isStopWord(word: string)`**
  - **Args:** `word: string`
  - **Returns:** `boolean`
  - **Purpose:** Check if word is a common stop word to exclude from keywords

---

## Type Definitions

### `/src/types/content.ts`
**Purpose:** TypeScript type definitions for content and component props.

#### Type Aliases:
- **`BlogPost`** = `CollectionEntry<'posts'>` - Main blog post type from Astro
- **`BlogPostData`** = `BlogPost['data']` - Blog post frontmatter data

#### Interfaces:

- **`QuizQuestion`** - Quiz functionality support
  - `q: string` - Question text
  - `options: string[]` - Answer options
  - `answer: number` - Correct answer index

- **`PostWithSlug`** - Extended post type with slug
  - `slug: string`
  - `id: string`
  - `collection: 'posts'`
  - `data: BlogPostData`
  - `body: string`

- **`SearchResult`** - Search result with scoring
  - `post: BlogPost`
  - `score: number`
  - `matches: string[]`

- **`PostsByYear`** - Posts grouped by year
  - `[year: string]: BlogPost[]`

- **`CategoryStats`** - Category statistics
  - `category: string`
  - `count: number`
  - `latestPost?: BlogPost`

- **`TagStats`** - Tag statistics
  - `tag: string`
  - `count: number`
  - `posts: BlogPost[]`

- **`BaseLayoutProps`** - Base layout component props
  - `title?: string`
  - `description?: string`
  - `image?: string`

- **`PostLayoutProps`** - Post layout component props
  - `post: BlogPost`
  - `content: any`
  - `relatedPosts?: BlogPost[]`

- **`PaginationResult<T>`** - Pagination result structure
  - `data: T[]`
  - `currentPage: number`
  - `totalPages: number`
  - `hasNext: boolean`
  - `hasPrev: boolean`

- **`Author`** - Author information
  - `name: string`
  - `bio?: string`
  - `avatar?: string`
  - `social?: {twitter?: string, linkedin?: string, github?: string}`

### `/src/types/global.d.ts`
**Purpose:** Global TypeScript declarations and ambient module types.

---

## Astro Components

### Feature Components (`/src/components/features/`)

#### `/src/components/features/AuthorBio.astro`
**Purpose:** Displays information about a post author with avatar, bio, and social links.

**Props Interface:**
```typescript
interface Props {
  name: string;
}
```

**Features:**
- Retrieves author data from `BLOG_CONFIG.authors`
- Responsive design with flexbox layout
- Social media links (Twitter, LinkedIn)
- Fallback for missing author data
- Dark mode support
- Responsive avatar with border styling

#### `/src/components/features/NewsletterSignup.astro`
**Purpose:** Newsletter subscription component with configurable positioning.

**Props Interface:**
```typescript
interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
  position?: 'inline' | 'footer';
}
```

**Features:**
- Two display modes: inline and footer positioning
- Configurable text content
- Responsive form layout
- Primary color theming
- Email validation attributes

#### `/src/components/features/PageNavigation.astro`
**Purpose:** Pagination navigation for blog posts and category pages.

#### `/src/components/features/RelatedPosts.astro`
**Purpose:** Displays related posts section with configurable limit.

#### `/src/components/features/UpstoxCTA.astro`
**Purpose:** Upstox call-to-action component for monetization integration.

### Layout Components (`/src/components/layout/`)

#### `/src/components/layout/ConfigurableHeader.astro`
**Purpose:** Main site header with navigation, logo, and responsive menu.

**Features:**
- Configuration-driven navigation from `BLOG_CONFIG.navigation.header`
- Logo integration with theme-aware display
- Mobile-responsive hamburger menu
- Dark mode toggle
- Search functionality integration
- Multi-level navigation support

#### `/src/components/layout/ConfigurableFooter.astro`
**Purpose:** Site footer with configurable sections and links.

**Features:**
- Multiple footer sections from configuration
- Social media links integration
- Newsletter signup integration
- Copyright and legal links
- Responsive column layout
- Dark mode styling

### UI Components (`/src/components/ui/`)

#### `/src/components/ui/PostCard.astro`
**Purpose:** Unified post card component for displaying blog posts in listings.

**Props Interface:**
```typescript
interface Props {
  post: BlogPost;
  lazyLoadImage?: boolean;
  class?: string;
}
```

**Features:**
- Hero image with responsive sizing
- Category badge with theming
- Post title, excerpt, and metadata
- Author information display
- Read time calculation
- Hover effects and transitions
- Click-to-navigate functionality
- Lazy loading support

**Internal Functions:**
- **`formatDate(date: Date)`**
  - **Args:** `date: Date`
  - **Returns:** `string`
  - **Purpose:** Format date using Intl.DateTimeFormat with locale support

#### `/src/components/ui/ResponsiveImage.astro`
**Purpose:** Responsive image component with WebP optimization and lazy loading.

**Props Interface:**
```typescript
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  densities?: number[];
  class?: string;
  loading?: 'lazy' | 'eager';
}
```

**Features:**
- Multiple density support (1x, 1.5x, 2x)
- WebP format optimization
- Fallback image support
- Lazy loading by default
- Custom CSS classes
- Accessibility attributes

#### `/src/components/ui/FormattedDate.astro`
**Purpose:** Date formatting component with internationalization support.

#### `/src/components/ui/Logo.astro`
**Purpose:** Site logo component with theme-aware switching.

#### `/src/components/ui/Navigation.astro`
**Purpose:** Navigation menu component with multi-level support.

#### `/src/components/ui/SocialLinks.astro`
**Purpose:** Social media links component with icon integration.

### SEO Components (`/src/components/seo/`)

#### `/src/components/seo/PWAHead.astro`
**Purpose:** Progressive Web App meta tags and service worker registration.

**Features:**
- PWA manifest link
- Theme color meta tags
- Apple touch icon links
- Service worker registration
- Install prompt handling
- PWA-specific meta tags

---

## Layout Components

### `/src/layouts/BaseLayout.astro`
**Purpose:** Base layout template for all pages with SEO, PWA, and global styling.

**Props Interface:**
```typescript
interface BaseLayoutProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalURL?: URL;
}
```

**Features:**
- SEO meta tags generation
- Open Graph image generation
- PWA head integration
- Dark mode theme initialization
- Global CSS imports
- Structured data integration
- Configurable header and footer

**Internal Functions:**
- Uses `generatePageTitle()` from SEO utilities
- Uses `generateOgImageUrl()` for social sharing
- Integrates with `PWAHead` component
- Configurable theme detection

### `/src/layouts/PostLayout.astro`
**Purpose:** Specialized layout for individual blog posts with additional features.

**Props Interface:**
```typescript
interface PostLayoutProps {
  post: BlogPost;
  content: any;
  relatedPosts?: BlogPost[];
}
```

**Features:**
- Post-specific SEO optimization
- Author bio integration
- Related posts section
- Social sharing buttons
- Reading time calculation
- Post navigation (prev/next)
- Structured data for articles

---

## Page Routes

### Static Pages

#### `/src/pages/index.astro`
**Purpose:** Homepage with featured posts, latest posts, and hero section.

**Static Functions:**
- Uses `getFeaturedPosts()` to get featured content
- Uses `getLatestPosts()` for recent posts
- Integrates hero configuration from blog config

#### `/src/pages/about.astro`
**Purpose:** About page with configurable content sections.

#### `/src/pages/contact.astro`
**Purpose:** Contact page with form and business information.

#### `/src/pages/404.astro`
**Purpose:** Custom 404 error page with navigation back to site.

#### `/src/pages/offline.astro`
**Purpose:** PWA offline fallback page.

#### `/src/pages/disclaimer.astro`
**Purpose:** Legal disclaimer page with configurable content.

### Dynamic Pages

#### `/src/pages/posts/[slug].astro`
**Purpose:** Individual blog post pages with dynamic routing.

**Static Functions:**
- **`getStaticPaths()`**
  - **Args:** None
  - **Returns:** `Promise<Array<{params: {slug: string}, props: {entry: CollectionEntry<'posts'>, relatedPosts: BlogPost[]}}>>`
  - **Purpose:** Generate static paths for all blog posts with related posts

**Features:**
- Dynamic slug-based routing
- Related posts pre-generation
- Post content rendering
- SEO optimization per post

#### `/src/pages/posts/index.astro`
**Purpose:** Blog posts index page with pagination.

#### `/src/pages/categories/[category]/index.astro`
**Purpose:** Category landing pages with post listings.

#### `/src/pages/categories/[category]/[page].astro`
**Purpose:** Paginated category pages.

#### `/src/pages/categories/[category]/page/[page].astro`
**Purpose:** Alternative pagination URL structure for categories.

#### `/src/pages/categories/index.astro`
**Purpose:** Categories overview page.

#### `/src/pages/tags/[tag]/index.astro`
**Purpose:** Tag-based post listings.

#### `/src/pages/tags/[tag]/[page].astro`
**Purpose:** Paginated tag pages.

#### `/src/pages/tags/index.astro`
**Purpose:** Tags overview page.

#### `/src/pages/posts/page/[page].astro`
**Purpose:** Paginated blog posts listings.

#### `/src/pages/privacy-policy.astro`
**Purpose:** Privacy policy page with configurable legal content.

#### `/src/pages/terms-of-service.astro`
**Purpose:** Terms of service page with configurable legal content.

---

## API Endpoints

### `/src/pages/manifest.json.ts`
**Purpose:** PWA manifest endpoint that generates web app manifest from blog configuration.

**Exported Functions:**
- **`GET()`**
  - **Args:** None
  - **Returns:** `Response` (JSON manifest)
  - **Purpose:** Generate and serve PWA manifest JSON with icons, shortcuts, and theme colors from blog config

**Features:**
- Dynamic manifest generation from `BLOG_CONFIG.pwa`
- Icon path resolution and validation
- Theme color integration
- Shortcuts generation from navigation
- Proper JSON response headers

### `/src/pages/sitemap.xml.ts`
**Purpose:** XML sitemap generation endpoint for SEO optimization.

**Exported Functions:**
- **`GET()`**
  - **Args:** None
  - **Returns:** `Response` (XML sitemap)
  - **Purpose:** Generate and serve sitemap.xml with all pages and posts for search engines

**Features:**
- Dynamic sitemap generation from all posts and pages
- Proper XML formatting with lastmod dates
- Automatic URL canonicalization
- SEO-optimized priority and changefreq values

### `/src/pages/search-index.json.ts`
**Purpose:** Search index endpoint for client-side search functionality.

**Exported Functions:**
- **`GET()`**
  - **Args:** None
  - **Returns:** `Response` (JSON search index)
  - **Purpose:** Generate and serve search index containing all posts for client-side search

**Features:**
- Full-text search index generation
- Post metadata inclusion (title, excerpt, category, tags)
- Optimized for client-side search libraries
- Automatic content indexing

---

## Scripts and Build Tools

### `/astro.config.mjs`
**Purpose:** Astro framework configuration file with integrations and build settings.

**Configuration Features:**
- React integration for interactive components
- Tailwind CSS integration
- Content collections configuration
- Build output settings
- Site URL configuration
- Image optimization settings

### Service Worker (`/public/sw.js`)
**Purpose:** Service worker for PWA offline functionality and caching.

**Functions:**
- **`install` event handler**
  - **Purpose:** Cache essential assets for offline use
  - **Features:** Pre-caching of core pages and assets

- **`fetch` event handler**
  - **Purpose:** Intercept network requests and serve cached content when offline
  - **Features:** Network-first strategy with offline fallback

- **`activate` event handler**
  - **Purpose:** Clean up old caches and activate new service worker
  - **Features:** Cache version management

### Build Scripts (`/package.json`)
**Purpose:** NPM scripts for development, building, and optimization.

**Available Scripts:**
- **`npm run dev`** - Start development server
- **`npm run build`** - Build production site
- **`npm run preview`** - Preview built site
- **`npm run optimize-images`** - Optimize images for web
- **`npm run type-check`** - TypeScript type checking

### `/optimize-images.js`
**Purpose:** Custom script for optimizing images in the public directory.

**Functions:**
- **`optimizeImages()`**
  - **Purpose:** Convert and optimize images to WebP format
  - **Features:** Batch processing, size reduction, format conversion

---

## Configuration Files

### `/tailwind.config.mjs`
**Purpose:** Tailwind CSS configuration with custom theme and plugins.

**Configuration Features:**
- Custom color palette from blog configuration
- Typography plugin integration
- Dark mode support
- Custom component classes
- Content path specifications

### `/tsconfig.json`
**Purpose:** TypeScript configuration for the project.

**Configuration Features:**
- Astro-specific TypeScript settings
- Path mapping for imports
- Strict type checking
- Modern ECMAScript target

### `/.vscode/settings.json`
**Purpose:** VS Code workspace settings for consistent development experience.

**Settings:**
- Astro language server configuration
- File association mappings
- Auto-formatting settings
- Extension recommendations

### `/.vscode/extensions.json`
**Purpose:** Recommended VS Code extensions for the project.

**Recommended Extensions:**
- Astro language support
- Tailwind CSS IntelliSense
- TypeScript support
- Prettier formatting

---

## Additional Utility Files

### `/src/env.d.ts`
**Purpose:** TypeScript environment declarations for Astro.

**Declarations:**
- Astro client types
- Image import types
- Content collection types

### `/src/styles/global.css`
**Purpose:** Global CSS styles and Tailwind directives.

**Features:**
- Tailwind CSS imports
- Custom CSS variables
- Dark mode styles
- Global component styles
- Typography customizations

### `/public/robots.txt`
**Purpose:** Search engine crawling instructions.

**Configuration:**
- Allow all user agents
- Sitemap location reference
- Crawl delay settings

---

## Content Configuration

### `/src/content/config.ts`
**Purpose:** Astro content collection configuration and schema validation.

**Exported Collections:**
- **`collections`** - Content collection definitions with Zod schemas

**Posts Collection Schema:**
- `title: string` (required) - Post title
- `description: string` (required) - Post description/excerpt  
- `pubDate: Date` (required) - Publication date
- `heroImage?: string` (optional) - Featured image URL
- `heroImageAlt?: string` (optional) - Alt text for featured image
- `category: string` (required) - Post category
- `tags: string[]` (required) - Array of post tags
- `featured?: boolean` (optional) - Whether post is featured
- `draft?: boolean` (optional) - Whether post is draft
- `author?: string` (optional) - Post author name

**Schema Validation:**
- Uses Zod for runtime type checking
- Ensures data integrity for all posts
- Validates frontmatter structure
- Provides TypeScript type safety

---

## Key Features Summary

### 1. **Configuration-Driven Architecture**
- Zero hardcoding approach
- Everything configurable via `current-config.ts`
- Type-safe configuration with TypeScript interfaces
- Support for multiple niche templates

### 2. **Content Management System**
- MDX-based posts with frontmatter validation
- Advanced querying and filtering capabilities
- Related posts algorithm with multiple factors
- Full-text search with scoring
- Category and tag management

### 3. **SEO Optimization**
- Structured data generation (JSON-LD)
- Dynamic meta tag generation
- Sitemap automation
- Open Graph image generation
- Keyword extraction

### 4. **Progressive Web App Support**
- Dynamic manifest generation
- Auto-generated icons and shortcuts
- Service worker integration
- Offline page support
- Configuration validation

### 5. **Image Management**
- Path resolution for separated content
- Optimized image serving
- WebP format support
- Responsive image sizing

### 6. **Performance Features**
- Static site generation
- Pagination for large content sets
- Optimized build process
- Lazy loading support

---

## Dependencies and Integration

### External Dependencies:
- **Astro** - Static site generator framework
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Styling and theme system
- **Zod** - Schema validation for content

### Internal Architecture:
- **Modular library structure** (`/src/lib/`)
- **Type-first development** (`/src/types/`)
- **Configuration-driven** (`/src/config/`)
- **Component-based UI** (`/src/components/`)

---

*This documentation is generated from actual source code analysis and reflects the current state of the FinHux Blog CMS codebase as of July 1, 2025.*
