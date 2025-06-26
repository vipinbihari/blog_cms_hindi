# 🚀 Blog Template System Guide

This guide will help you customize your blog for any niche using our powerful configuration system.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Overview](#configuration-overview)
3. [Niche Templates](#niche-templates)
4. [Theme Customization](#theme-customization)
5. [Navigation & Branding](#navigation--branding)
6. [Legal Pages](#legal-pages)
7. [Advanced Configuration](#advanced-configuration)
8. [Best Practices](#best-practices)

## 🏃‍♂️ Quick Start

### Option 1: Use a Pre-built Template

1. **Choose a template** from `src/config/templates/`:
   - `technology-blog.ts` - For programming/tech blogs
   - `lifestyle-blog.ts` - For wellness/lifestyle blogs
   - More templates available...

2. **Copy the configuration**:
   ```bash
   cp src/config/templates/technology-blog.ts src/config/my-config.ts
   ```

3. **Update `current-config.ts`**:
   ```typescript
   // Replace the existing export in src/config/current-config.ts
   export { TECHNOLOGY_BLOG_CONFIG as BLOG_CONFIG } from './my-config';
   ```

4. **Customize** the configuration values in `my-config.ts`

### Option 2: Start from Scratch

1. **Copy the current config**:
   ```bash
   cp src/config/current-config.ts src/config/my-config.ts
   ```

2. **Modify** `my-config.ts` with your details

3. **Update the export** in `current-config.ts`

## ⚙️ Configuration Overview

The blog configuration is organized into logical sections:

### Site Identity
```typescript
site: {
  name: 'Your Blog Name',           // Site title
  tagline: 'Your Tagline',          // Optional subtitle
  description: 'Site description',   // Meta description
  url: 'https://yourdomain.com/',   // Base URL (centralized)
  author: 'Your Name',              // Default author
  email: 'your@email.com',          // Contact email (centralized)
  language: 'en',                   // Language code
  locale: 'en_US',                  // Locale for i18n
}
```

---

### Image Handling & Zoom

- **Hero images** and **in-post images** open in a lightweight custom zoom modal.
- To opt into zoom on a custom image, use the `enableLightbox={true}` prop on `ResponsiveImage`.
- All images in blog post content (MDX/Markdown) are automatically wrapped for zoom via a small client-side script.
- Homepage post card images do **not** use the zoom effect for clarity.


### Branding & Visual Identity
```typescript
branding: {
  logo: {
    light: '/images/logo-light.svg', // Light mode logo
    dark: '/images/logo-dark.svg',   // Dark mode logo (optional)
    alt: 'Logo Alt Text',
    width: 180,                      // Logo width
    height: 40,                      // Logo height
  },
  favicon: '/favicon.svg',
  ogImage: '/images/og-image.jpg',
  appleTouchIcon: '/images/apple-touch-icon.png',
}
```

### Theme Configuration
```typescript
theme: {
  colors: {
    primary: THEME_PRESETS.blue.primary,     // Primary color scale
    secondary: THEME_PRESETS.blue.secondary, // Secondary color scale
    accent: THEME_PRESETS.green.primary,     // Optional accent color
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Fira Code', 'Monaco', 'monospace'],
    },
    // ... more typography options
  },
}
```

## 🎨 Niche Templates

### Available Niches

| Niche | Categories | Navigation | Theme |
|-------|------------|------------|-------|
| **Finance** | technical-analysis, fundamental-analysis, market-news | Finance-focused | Blue |
| **Technology** | web-development, mobile-apps, ai-ml, devops | Tech-focused | Green |
| **Lifestyle** | health-fitness, relationships, personal-growth | Lifestyle-focused | Purple |
| **Food** | recipes, cooking-tips, nutrition | Food-focused | Orange |
| **Travel** | destinations, travel-tips, budget-travel | Travel-focused | Blue |

### Creating Custom Niches

```typescript
// Add to NICHE_PRESETS in blog-template.ts
myNiche: {
  categories: ['category-1', 'category-2', 'category-3'],
  defaultTags: ['tag1', 'tag2', 'tag3'],
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Category 1', href: '/categories/category-1' },
    // ... more navigation items
  ],
}
```

## 🎨 Theme Customization

### Pre-built Color Schemes

```typescript
// Available in THEME_PRESETS
THEME_PRESETS.blue    // Professional blue
THEME_PRESETS.green   // Tech green
THEME_PRESETS.purple  // Creative purple
THEME_PRESETS.orange  // Vibrant orange
```

### Custom Color Scheme

```typescript
theme: {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ... full color scale
      900: '#0c4a6e',
      950: '#082f49',
    },
    secondary: {
      // ... secondary colors
    },
  },
}
```

### Typography Customization

```typescript
typography: {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['Fira Code', 'Monaco', 'monospace'],
  },
  fontSizes: {
    base: '16px',  // Base font size
    lg: '18px',    // Large text
    xl: '20px',    // Extra large text
  },
}
```

## 🏞️ Hero Section Configuration

### Background Image Options

The hero section on the homepage can be customized with a configurable background image:

```typescript
layout: {
  // Other layout settings...
  heroConfig: {
    title: 'Welcome to Your Blog',
    subtitle: 'Discover amazing content and resources',
    ctaButton1: { text: 'Explore Articles', url: '/posts/page/1' },
    ctaButton2: { text: 'About Us', url: '/about' },
    
    // Option 1: Simple string path
    heroBackgroundImage: '/images/blog/home-background.jpg',
    
    // Option 2: Comprehensive object configuration
    heroBackgroundImage: {
      src: '/images/blog/home-background.jpg',
      alt: 'Hero background image',
      width: 1920,
      height: 400
    }
  }
}
```

The hero section automatically adapts to the current theme:
- In light mode: White overlay with dark text
- In dark mode: Dark overlay with light text

This ensures optimal readability regardless of the background image used.

## 🧭 Navigation & Branding

### Usage

### PostCard Component
- Use `<PostCard post={post} />` for all post previews (featured, latest, related).
- Supports hero image, category, title, excerpt, author, and date. Fully styled for light/dark mode.

### Homepage Layout
- Homepage now displays featured and latest posts using the unified PostCard component.
- The "Read Latest Articles" button links to `#latest-posts`.

### Related Posts
- `RelatedPosts.astro` uses PostCard and is wrapped with `not-prose` to avoid typography plugin conflicts.

### Social Media Icons
- Improved dark mode contrast for share and author icons using Tailwind dark mode classes.

### Header Navigation

```typescript
navigation: {
  header: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { 
      label: 'Categories', 
      href: '/categories',
      children: [
        { label: 'Tech', href: '/categories/tech' },
        { label: 'Design', href: '/categories/design' },
      ]
    },
    { 
      label: 'GitHub', 
      href: 'https://github.com/yourrepo', 
      external: true 
    },
  ],
}
```

### Footer Configuration

```typescript
navigation: {
  footer: [
    {
      title: 'Content',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Categories', href: '/categories' },
        { label: 'Tags', href: '/tags' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
      ],
    },
  ],
}
```

### Social Media Links

```typescript
navigation: {
  social: [
    {
      platform: 'twitter',
      url: 'https://twitter.com/yourusername',
      label: 'Follow on Twitter',
    },
    {
      platform: 'github',
      url: 'https://github.com/yourusername',
      label: 'View on GitHub',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/yourprofile',
      label: 'Connect on LinkedIn',
    },
    // More platforms: facebook, instagram, youtube, discord
  ],
}
```

## 📝 Legal Pages

Legal pages are now a required part of the blog configuration. The template includes fully configurable privacy policy, terms of service, and disclaimer pages.

### Basic Structure

```typescript
legalPages: {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'June 7, 2025',
    sections: [
      {
        title: 'Introduction',
        content: 'This privacy policy outlines how we collect and use information...'  
      },
      {
        title: 'Information We Collect',
        content: 'We collect personal information such as...'  
      },
      // Additional sections
    ]
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'June 7, 2025',
    sections: [...] // Similar structure to privacy
  },
  disclaimer: {
    title: 'Disclaimer',
    lastUpdated: 'June 7, 2025',
    sections: [...] // Similar structure to privacy
  }
}
```

### Best Practices for Legal Pages

1. **Keep content updated**: Regularly review and update your legal pages
2. **Industry-specific**: Tailor content to your blog's niche (finance, health, tech, etc.)
3. **Footer links**: Always include links to legal pages in your footer navigation
4. **Clear language**: Use plain language even for legal content when possible
5. **Required sections**: Include all regulatory required sections for your jurisdiction

## 🔧 Advanced Configuration

### Managing Featured Content

#### Upstox Account Opening CTA
- The blog includes a modern, glassmorphic Upstox Demat Account Opening card, shown in every post.
 - To customize, edit `src/components/features/UpstoxCTA.astro` and the Upstox logo in `public/images/blog/upstox.jpeg`.
- The CTA features gradients, responsive layout, and a visually appealing design for higher conversion and professionalism.

To highlight specific articles on your homepage, you can mark them as "featured" directly in their Markdown frontmatter. This gives you precise control over which posts get top billing.

**How to use it:**

Add the `featured` flag to the frontmatter of any post you want to feature. Only posts with `featured: true` will appear in the featured section. If you do not set `featured: true`, your post will not be shown as featured, even if there are fewer featured posts than the configured limit:

```yaml
---
title: "My Amazing Featured Article"
date: 2023-10-27
excerpt: "This article is so good, it deserves to be featured!"
tags: ["important", "highlight"]
category: "Must Read"
author: "Jane Doe"
heroImage: "/images/amazing-article.jpg"
featured: true  # Add this line to mark the post as featured
---

# Your article content starts here...
```

**Impact on Homepage:**

- Posts with `featured: true` will be prioritized in the "Featured Articles" section on your homepage.
- They will be sorted by date among other featured posts (newest first).
- If there are more manually featured posts than the configured display limit for this section, only the newest ones up to the limit will be shown.
- The featured section now displays **only** posts with `featured: true`. There is no fallback to regular posts.

Additionally, the homepage now includes a separate "Latest Posts" section, which displays recent articles that are not currently featured, ensuring fresh content is always visible and distinct from your curated featured selections.

### Content Settings

```typescript
content: {
  postsPerPage: 10,           // Posts per page
  featuredPostsCount: 3,      // Featured posts on homepage
  relatedPostsCount: 4,       // Related posts per article
  showReadingTime: true,      // Show estimated reading time
  showTableOfContents: true,  // Auto-generate TOC
  enableComments: false,      // Enable comment system
  enableNewsletter: true,     // Show newsletter signup
}
```

### Feature Toggles

```typescript
features: {
  darkMode: true,             // Enable dark mode toggle
  search: true,               // Enable search functionality
  analytics: {                // Analytics configuration
    provider: 'google',       // 'google' | 'plausible' | 'custom'
    id: 'G-XXXXXXXXXX',
  },
}
```

### SEO Configuration

```typescript
seo: {
  defaultTitle: 'Your Blog',
  titleTemplate: '%s | Your Blog',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  twitterHandle: '@yourusername',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Your Blog Name',
  },
}
```

## 📝 Best Practices

### 1. Logo Guidelines
- **Format**: SVG preferred for scalability
- **Size**: Keep file size under 50KB
- **Dimensions**: Maintain aspect ratio
- **Dark Mode**: Provide separate dark mode logo if needed

### 2. Color Scheme Selection
- **Accessibility**: Ensure sufficient contrast ratios
- **Brand Alignment**: Choose colors that match your brand
- **Readability**: Test in both light and dark modes

### 3. Navigation Structure
- **Keep It Simple**: Maximum 6-7 main navigation items
- **Logical Grouping**: Group related items in footer sections
- **Mobile-Friendly**: Navigation adapts to mobile screens

### 4. Content Configuration
- **Performance**: Don't load too many posts per page (8-12 recommended)
- **Engagement**: Show 3-4 related posts for better engagement
- **Features**: Enable features that add value to your audience

### 5. SEO Optimization
- **Keywords**: Use relevant, specific keywords
- **Descriptions**: Keep meta descriptions under 160 characters
- **URLs**: Use clean, descriptive URLs
- **Social Media**: Configure Open Graph and Twitter cards

## 🔄 Switching Configurations

### For Development
```typescript
// In current-config.ts
export { DEVELOPMENT_CONFIG as BLOG_CONFIG } from './templates/development';
```

### For Production
```typescript
// In current-config.ts  
export { PRODUCTION_CONFIG as BLOG_CONFIG } from './my-config';
```

### Environment-based
```typescript
// In current-config.ts
const config = process.env.NODE_ENV === 'production' 
  ? PRODUCTION_CONFIG 
  : DEVELOPMENT_CONFIG;

export { config as BLOG_CONFIG };
```

## 🎯 Examples by Use Case

### Tech Blog
- **Theme**: Green (THEME_PRESETS.green)
- **Categories**: web-development, mobile-apps, ai-ml
- **Features**: Comments, dark mode, search
- **Typography**: Code-friendly fonts (Fira Code)

### Lifestyle Blog
- **Theme**: Purple (THEME_PRESETS.purple)
- **Categories**: health-fitness, relationships, personal-growth
- **Features**: Newsletter, social sharing
- **Typography**: Readable serif fonts (Playfair Display)

### Business Blog
- **Theme**: Blue (THEME_PRESETS.blue)
- **Categories**: strategy, marketing, leadership
- **Features**: Professional layout, analytics
- **Typography**: Clean sans-serif fonts (Inter)

### Food Blog
- **Theme**: Orange (THEME_PRESETS.orange)
- **Categories**: recipes, cooking-tips, nutrition
- **Features**: Image-focused, newsletter
- **Typography**: Friendly fonts with good readability

## 🚀 Going Live

1. **Test Locally**: Run `npm run dev` and test all features
2. **Build**: Run `npm run build` to check for errors
3. **Deploy**: Upload to your hosting provider
4. **Configure Domain**: Point your domain to the hosting
5. **Analytics**: Set up analytics tracking
6. **Monitor**: Check site performance and user engagement

## 🆘 Troubleshooting

### Common Issues

1. **Logo not showing**: Check file path and format
2. **Colors not applying**: Verify Tailwind config regeneration
3. **Navigation broken**: Check navigation structure and URLs
4. **Build errors**: Verify all imports and TypeScript types

### Getting Help

- Check the console for error messages
- Verify file paths and imports
- Ensure all required fields are filled
- Test with default configuration first

---

**Need more help?** Check out the example configurations in `src/config/templates/` for inspiration! 
