# Blog CMS Refactoring Guide

This document outlines the modular refactoring of the blog CMS for better maintainability and organization.

## 🏗️ New Architecture Overview

The codebase has been restructured to follow a feature-based modular architecture:

```
src/
├── config/           # Centralized configuration
├── lib/              # Feature-based utilities
│   ├── content/      # Content queries and operations
│   ├── seo/          # SEO utilities
│   ├── images/       # Image processing utilities
│   └── pagination/   # Pagination helpers
├── types/            # Centralized type definitions
├── components/       # UI components (to be organized)
├── layouts/          # Page layouts
└── pages/            # Astro pages
```

## 🚀 Key Improvements

### 1. Centralized Configuration (`src/config/site.ts`)
- Single source of truth for site settings
- Easy to modify site-wide configurations
- Type-safe configuration with TypeScript

```typescript
import { SITE_CONFIG } from '../config/site';

// Before: Hardcoded values
const title = "YourSiteName";

// After: Centralized config
const title = SITE_CONFIG.title;
```

### 2. Feature-Based Utilities (`src/lib/`)

#### Image Handling & Zoom
- All hero images and in-post images open in a lightweight custom zoom modal.
- Zoom is enabled via the `enableLightbox` prop on `ResponsiveImage` or automatically for MDX images.
- Homepage post card images do not use the zoom effect.


#### Content Queries (`src/lib/content/index.ts`)
```typescript
import { getAllPosts, getFeaturedPosts, getPostsByCategory } from '../lib/content';

// Get all posts
const posts = await getAllPosts();

// Get featured posts
const featured = await getFeaturedPosts(3);

// Get posts by category
const categoryPosts = await getPostsByCategory('technical-analysis');
```

#### Search Functionality (`src/lib/content/search.ts`)
```typescript
import { searchPosts, searchPostsWithScore, getSearchSuggestions } from '../lib/content/search';

// Simple search
const results = await searchPosts('investing');

// Advanced search with scoring
const scoredResults = await searchPostsWithScore('stock market');

// Get search suggestions
const suggestions = await getSearchSuggestions('inv', 5);
```

#### SEO Utilities (`src/lib/seo/index.ts`)
```typescript
import { generateOgImageUrl, generatePostStructuredData } from '../lib/seo';

// Generate OG image
const ogImage = generateOgImageUrl(post.title, post.heroImage);

// Generate structured data
const structuredData = generatePostStructuredData(post, postUrl);
```

#### Image Utilities (`src/lib/images/index.ts`)
```typescript
import { generatePlaceholderImage, getImageLoadingStrategy } from '../lib/images';

// Generate placeholder
const placeholder = generatePlaceholderImage(title, 800, 400);

// Optimize loading
const loading = getImageLoadingStrategy(true, false); // 'eager' or 'lazy'
```

#### Pagination (`src/lib/pagination/index.ts`)
```typescript
import { paginate, generatePaginationPaths } from '../lib/pagination';

// Paginate data
const paginatedPosts = paginate(posts, currentPage, 10);

// Generate static paths for Astro
const paths = generatePaginationPaths(posts, 10, '/posts/page');
```

### 3. Centralized Types (`src/types/content.ts`)
- No more type duplication
- Better TypeScript support
- Easier maintenance

```typescript
import type { BlogPost, CategoryStats, SearchResult } from '../types/content';
```

### 4. Easy Imports (`src/lib/index.ts`)
```typescript
// Single import for everything
import { 
  getAllPosts, 
  getFeaturedPosts, 
  searchPosts, 
  generateOgImageUrl,
  SITE_CONFIG 
} from '../lib';
```

## 📦 Dependency Cleanup

### Removed Unused Dependencies
- `lunr` - Not being used for search
- `openai` - No AI features implemented
- `@google/genai` - No AI features implemented

### Optimized Dependencies
- Replaced date-fns usage with native Date methods where possible
- Kept date-fns only for formatting in components

## 🔄 Migration Guide

### From Old Structure to New

#### Before (Old contentUtils.ts)
```typescript
import { getFeaturedPosts } from '../utils/contentUtils';

// Required passing posts array
const featured = getFeaturedPosts(allPosts, 3);
```

#### After (New lib structure)
```typescript
import { getFeaturedPosts } from '../lib/content/queries';

// Direct async function, no need to pass posts
const featured = await getFeaturedPosts(3);
```

### Updating Existing Components

1. **Replace hardcoded config values**:
   ```typescript
   // Before
   const siteTitle = "YourSiteName";
   
   // After
   import { SITE_CONFIG } from '../config/site';
   const siteTitle = SITE_CONFIG.title;
   ```

2. **Use new utility functions**:
   ```typescript
   // Before
   const placeholder = `https://placehold.co/400x200?text=${title}`;
   
   // After
   import { generatePlaceholderImage } from '../lib/images/utils';
   const placeholder = generatePlaceholderImage(title, 400, 200);
   ```

## 🧹 Code Organization Best Practices

### Component Organization (Recommended)
```
src/components/
├── ui/               # Reusable UI components
│   ├── Button.astro
│   ├── Card.astro
│   └── Modal.astro
├── features/         # Feature-specific components
│   ├── search/
│   ├── newsletter/
│   └── comments/
└── layout/           # Layout components
    ├── Header.astro
    ├── Footer.astro
    └── Navigation.astro
```

### File Naming Conventions
- Use PascalCase for components: `BlogPost.astro`
- Use camelCase for utilities: `contentQueries.ts`
- Use kebab-case for pages: `blog-post.astro`

## 🚀 Next Steps

### Immediate Tasks
1. ✅ Centralize configuration
2. ✅ Create feature-based utilities
3. ✅ Implement centralized types
4. ✅ Update core layouts and pages
5. 🔄 Organize components by feature
6. 🔄 Update remaining pages to use new structure
7. 🔄 Add comprehensive error handling
8. 🔄 Implement caching strategies

### Future Enhancements
- [ ] Add component-level testing
- [ ] Implement performance monitoring
- [ ] Add progressive web app features
- [ ] Integrate content management system
- [ ] Add real-time search with indexing
- [ ] Implement advanced SEO features

## 🔧 Development Workflow

### Adding New Features
1. Create feature directory in `src/lib/`
2. Add types to `src/types/content.ts`
3. Create utility functions
4. Export from `src/lib/index.ts`
5. Update documentation

### Modifying Configuration
1. Update `src/config/site.ts`
2. Types are automatically enforced
3. Changes propagate throughout the app

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Modular Architecture Patterns](https://martinfowler.com/articles/microservices.html)

---

This refactoring ensures better maintainability, type safety, and developer experience while preserving all existing functionality.

## Refactoring Steps

### Unified PostCard Component
- Created `src/components/ui/PostCard.astro` for all post previews.
- Removed duplicate markup from homepage, related posts, and archive pages.

### Homepage Refactor
- Both featured and latest posts now rendered with PostCard.
- Updated anchor for "Read Latest Articles" to `#latest-posts`.

### Related Posts
- Uses PostCard; wrapped with `not-prose` for isolation from prose styles.

### Dark Mode & Social Icons
- Improved dark mode contrast for all social icons and post cards.

### PostCard Refactor
- Unified component for all post previews.
- Removed duplicate markup from homepage, related posts, and archive pages.

### Homepage Changes
- Both featured and latest posts now rendered with PostCard.
- Updated anchor for "Read Latest Articles" to `#latest-posts`.

### Related Posts Update
- Uses PostCard; wrapped with `not-prose` for isolation from prose styles.

### Dark Mode/Social Icon Fixes
- Improved dark mode contrast for all social icons and post cards.
