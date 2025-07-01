# PWA Configuration Guide

## Overview

The blog CMS now supports Progressive Web App (PWA) functionality, allowing users to install your blog as an app on their devices. This guide explains how to configure PWA features for different blog niches.

## Features Implemented

✅ **Install Prompt**: Users can install the blog as an app on their device  
✅ **Configurable Manifest**: Dynamic manifest.json generation from config  
✅ **Service Worker**: Basic offline support and install prompt enablement  
✅ **Homescreen Icons**: Customizable app icons and splash screens  
✅ **Multi-Niche Support**: Easy configuration per blog niche  
✅ **Theme Integration**: PWA colors match your blog theme  

## Configuration

### Basic PWA Setup

Add the following to your `src/config/current-config.ts`:

```typescript
// PWA Configuration
pwa: {
  enabled: true, // Set to false to disable PWA features
  name: 'Your Blog Name', // Full app name
  shortName: 'Short Name', // Short name for homescreen (max 12 chars)
  description: 'Your blog description for the app store',
  themeColor: '#yourPrimaryColor', // Primary theme color
  backgroundColor: '#yourBackgroundColor', // Background color
  display: 'minimal-ui' as const, // App display mode
  orientation: 'any' as const, // Screen orientation
  scope: '/', // App scope
  startUrl: '/', // Start URL when app is launched
  categories: ['category1', 'category2'], // App store categories
  icons: [
    // Your app icons (see icon section below)
  ],
  shortcuts: [
    // App shortcuts (see shortcuts section below)
  ]
}
```

### Niche-Specific Configurations

#### Finance/Investment Blog (Current: FinHux)
```typescript
pwa: {
  enabled: true,
  name: 'FinHux - Investment Education',
  shortName: 'FinHux',
  description: 'Expert analysis and practical lessons on Indian and global stock markets. Install for quick access to the latest investment insights.',
  themeColor: '#10B981', // Green theme
  backgroundColor: '#F0FDF4',
  categories: ['finance', 'education', 'business', 'investment'],
  shortcuts: [
    {
      name: 'Market Analysis',
      url: '/categories/technical-analysis',
      description: 'Latest market analysis posts'
    },
    {
      name: 'Investment Tips',
      url: '/categories/fundamental-analysis',
      description: 'Investment strategies and tips'
    }
  ]
}
```

#### Technology Blog
```typescript
pwa: {
  enabled: true,
  name: 'TechInsights - Developer Resources',
  shortName: 'TechInsights',
  description: 'Latest technology trends, tutorials, and developer resources. Install for quick access to coding guides and tech news.',
  themeColor: '#3B82F6', // Blue theme
  backgroundColor: '#EFF6FF',
  categories: ['technology', 'education', 'programming', 'software'],
  shortcuts: [
    {
      name: 'Tutorials',
      url: '/categories/tutorials',
      description: 'Programming tutorials and guides'
    },
    {
      name: 'News',
      url: '/categories/tech-news',
      description: 'Latest technology news'
    }
  ]
}
```

#### Lifestyle Blog
```typescript
pwa: {
  enabled: true,
  name: 'LifeStyle Hub - Daily Inspiration',
  shortName: 'LifeStyle',
  description: 'Daily inspiration, wellness tips, and lifestyle advice. Install for quick access to health, beauty, and lifestyle content.',
  themeColor: '#EC4899', // Pink theme
  backgroundColor: '#FDF2F8',
  categories: ['lifestyle', 'health', 'wellness', 'inspiration'],
  shortcuts: [
    {
      name: 'Health Tips',
      url: '/categories/health',
      description: 'Health and wellness advice'
    },
    {
      name: 'Beauty',
      url: '/categories/beauty',
      description: 'Beauty tips and tutorials'
    }
  ]
}
```

#### Food Blog
```typescript
pwa: {
  enabled: true,
  name: 'Foodie Paradise - Recipe Collection',
  shortName: 'Foodie',
  description: 'Delicious recipes, cooking tips, and culinary adventures. Install for quick access to your favorite recipes.',
  themeColor: '#F59E0B', // Orange theme
  backgroundColor: '#FFFBEB',
  categories: ['food', 'recipes', 'cooking', 'lifestyle'],
  shortcuts: [
    {
      name: 'Recipes',
      url: '/categories/recipes',
      description: 'Browse all recipes'
    },
    {
      name: 'Quick Meals',
      url: '/categories/quick-meals',
      description: '30-minute meal ideas'
    }
  ]
}
```

#### Travel Blog
```typescript
pwa: {
  enabled: true,
  name: 'Wanderlust - Travel Guide',
  shortName: 'Wanderlust',
  description: 'Travel guides, tips, and destination inspiration. Install for offline access to travel planning resources.',
  themeColor: '#8B5CF6', // Purple theme
  backgroundColor: '#F5F3FF',
  categories: ['travel', 'lifestyle', 'adventure', 'tourism'],
  shortcuts: [
    {
      name: 'Destinations',
      url: '/categories/destinations',
      description: 'Explore travel destinations'
    },
    {
      name: 'Travel Tips',
      url: '/categories/travel-tips',
      description: 'Essential travel advice'
    }
  ]
}
```

## Icon Configuration

### Icon Requirements
- **64x64px**: Favicon and small icons
- **128x128px**: Standard app icon
- **192x192px**: Android homescreen icon
- **512x512px**: High-resolution icon and splash screen

### Icon Setup
```typescript
icons: [
  {
    src: '/images/blog/your-logo-64.png',
    sizes: '64x64',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: '/images/blog/your-logo-128.png',
    sizes: '128x128',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: '/images/blog/your-logo-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: '/images/blog/your-logo-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: '/images/blog/your-logo-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable' // For adaptive icons on Android
  }
]
```

## Display Modes

Choose the appropriate display mode for your blog:

- `'fullscreen'`: Full immersive experience
- `'standalone'`: Looks like a native app (recommended)
- `'minimal-ui'`: Basic browser UI (current default)
- `'browser'`: Regular browser tab

## App Categories

Use relevant categories for app store discovery:

**General Categories:**
- `'education'`, `'lifestyle'`, `'news'`, `'productivity'`

**Finance:**
- `'finance'`, `'business'`, `'investment'`, `'economics'`

**Technology:**
- `'technology'`, `'programming'`, `'software'`, `'development'`

**Food:**
- `'food'`, `'recipes'`, `'cooking'`, `'nutrition'`

**Travel:**
- `'travel'`, `'tourism'`, `'adventure'`, `'photography'`

## Testing PWA Installation

### Desktop (Chrome/Edge)
1. Visit your blog in Chrome/Edge
2. Look for install icon in address bar
3. Click to install as desktop app

### Mobile (Android)
1. Visit your blog in Chrome
2. Tap "Add to Home Screen" in menu
3. App icon appears on homescreen

### Mobile (iOS)
1. Visit your blog in Safari
2. Tap share button → "Add to Home Screen"
3. App icon appears on homescreen

## Advanced Configuration

### Custom Install Button
Add a custom install button to your blog:

```html
<button id="install-button" style="display: none;">
  Install App
</button>

<script>
  const installButton = document.getElementById('install-button');
  
  window.addEventListener('pwa-install-available', (event) => {
    installButton.style.display = 'block';
    installButton.onclick = () => window.installPWA();
  });
</script>
```

### Analytics Tracking
PWA installations are automatically tracked if you have Google Analytics enabled:

```javascript
// This is already included in PWAHead.astro
gtag('event', 'pwa_install', {
  event_category: 'PWA',
  event_label: 'App Installed'
});
```

## Troubleshooting

### Common Issues

1. **Install prompt not showing:**
   - Check that PWA is enabled in config
   - Ensure HTTPS is used (required for PWA)
   - Verify manifest.json is accessible at `/manifest.json`

2. **Icons not loading:**
   - Check that icon files exist in `public/images/blog/`
   - Verify file paths in PWA config
   - Ensure correct image formats (PNG recommended)

3. **Service worker errors:**
   - Check browser console for errors
   - Verify `/sw.js` is accessible
   - Clear browser cache and reload

### Debug Mode
In development, PWA debug information is logged to browser console. Check for:
- PWA configuration details
- Service worker registration status
- Manifest validation results

## Migration Between Niches

When changing your blog niche:

1. Update PWA configuration in `current-config.ts`
2. Replace icon files with niche-appropriate branding
3. Update app name, description, and categories
4. Adjust theme colors to match new design
5. Update shortcuts to reflect new content structure
6. Test installation on multiple devices

## Best Practices

1. **Keep shortName under 12 characters** for better display
2. **Use consistent branding** across all icon sizes
3. **Test on multiple devices** before deployment
4. **Update app version** when making significant changes
5. **Monitor installation metrics** via analytics
6. **Provide clear value proposition** in description

## Files Modified

- `src/config/blog-template.ts` - PWA interface definitions
- `src/config/current-config.ts` - Your PWA configuration
- `src/lib/pwa/manifest.ts` - Manifest generation utilities
- `src/pages/manifest.json.ts` - Dynamic manifest endpoint
- `src/components/seo/PWAHead.astro` - PWA meta tags and scripts
- `src/layouts/BaseLayout.astro` - PWA integration
- `src/pages/offline.astro` - Offline fallback page
- `public/sw.js` - Service worker for PWA functionality

## Support

For issues or questions about PWA configuration:
1. Check browser developer console for errors
2. Verify all required files are present
3. Test manifest.json endpoint directly
4. Ensure proper HTTPS setup for production

The PWA system is fully integrated with your existing configuration system, making it easy to deploy across multiple blog niches with minimal changes.
