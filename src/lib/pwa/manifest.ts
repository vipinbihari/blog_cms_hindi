/**
 * PWA Manifest Generation Utilities
 * ---------------------------------
 * PURPOSE
 *   Generate web app manifest.json dynamically from blog configuration
 *   Supports all PWA manifest fields with sensible defaults
 * 
 * USAGE
 *   import { generateManifest } from '../lib/pwa/manifest';
 *   const manifest = generateManifest(config);
 */

import type { BlogConfig, PWAConfig } from '../../config/blog-template';

export interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  scope: string;
  display: string;
  orientation: string;
  theme_color: string;
  background_color: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }[];
  categories?: string[];
  shortcuts?: {
    name: string;
    url: string;
    description?: string;
    icons?: {
      src: string;
      sizes: string;
    }[];
  }[];
  screenshots?: {
    src: string;
    sizes: string;
    type: string;
    form_factor?: string;
    label?: string;
  }[];
}

/**
 * Generates a complete web app manifest from blog configuration
 */
export function generateManifest(config: BlogConfig): WebAppManifest {
  const pwa = config.pwa;
  
  if (!pwa || !pwa.enabled) {
    throw new Error('PWA is not enabled in the blog configuration');
  }

  // Extract theme colors from the configuration
  const primaryColor = config.theme.colors.primary[500] || '#3B82F6';
  const backgroundColor = config.theme.colors.primary[50] || '#F8FAFC';

  // Generate icons - either use provided array or auto-generate
  const icons = pwa.icons === 'auto' ? generateDefaultIcons(config) : pwa.icons;
  
  // Generate shortcuts - either use provided array or auto-generate
  const shortcuts = pwa.shortcuts === 'auto' ? generateDefaultShortcuts(config) : pwa.shortcuts;

  const manifest: WebAppManifest = {
    name: pwa.name || config.site.name,
    short_name: pwa.shortName || config.site.name.substring(0, 12),
    description: pwa.description || config.site.description,
    start_url: pwa.startUrl || '/',
    scope: pwa.scope || '/',
    display: pwa.display || 'minimal-ui',
    orientation: pwa.orientation || 'any',
    theme_color: pwa.themeColor || primaryColor,
    background_color: pwa.backgroundColor || backgroundColor,
    icons: icons,
  };

  // Add optional fields if they exist
  if (pwa.categories && pwa.categories.length > 0) {
    manifest.categories = pwa.categories;
  }

  if (shortcuts && shortcuts.length > 0) {
    manifest.shortcuts = shortcuts.map(shortcut => ({
      name: shortcut.name,
      url: shortcut.url,
      description: shortcut.description,
      ...(shortcut.icon && {
        icons: [{
          src: shortcut.icon,
          sizes: '96x96'
        }]
      })
    }));
  }

  if (pwa.screenshots && pwa.screenshots.length > 0) {
    manifest.screenshots = pwa.screenshots.map(screenshot => ({
      src: screenshot.src,
      sizes: screenshot.sizes,
      type: screenshot.type,
      label: screenshot.label,
      form_factor: 'wide'
    }));
  }

  return manifest;
}

/**
 * Generates default PWA shortcuts from navigation configuration
 */
function generateDefaultShortcuts(config: BlogConfig): WebAppManifest['shortcuts'] {
  const shortcuts: WebAppManifest['shortcuts'] = [];
  
  // Add main navigation links as shortcuts (first 4 items)
  if (config.navigation?.header) {
    const mainLinks = config.navigation.header.slice(0, 4);
    for (const link of mainLinks) {
      shortcuts.push({
        name: link.label,
        url: link.href,
        description: `Navigate to ${link.label}`
      });
    }
  }
  
  // Add common shortcuts if not already present
  const commonShortcuts = [
    { name: 'Latest Posts', url: '/posts/page/1', description: 'View the latest posts' },
    { name: 'Categories', url: '/categories', description: 'Browse posts by category' },
    { name: 'About', url: '/about', description: `Learn more about ${config.site.name}` }
  ];
  
  for (const commonShortcut of commonShortcuts) {
    if (!shortcuts.some(s => s.url === commonShortcut.url) && shortcuts.length < 4) {
      shortcuts.push(commonShortcut);
    }
  }
  
  return shortcuts.slice(0, 4); // Limit to 4 shortcuts max
}

/**
 * Generates default PWA icons from the site logo
 */
function generateDefaultIcons(config: BlogConfig): WebAppManifest['icons'] {
  // Use high-quality ogImage for PWA icons and splash screen
  const highQualityLogo = config.branding.ogImage || config.branding.logo?.light || config.branding.favicon;
  const appleTouchIcon = config.branding.appleTouchIcon || highQualityLogo;

  return [
    {
      src: highQualityLogo,
      sizes: '64x64',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: highQualityLogo,
      sizes: '128x128',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: highQualityLogo,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: appleTouchIcon,
      sizes: '256x256',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: appleTouchIcon,
      sizes: '384x384',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: appleTouchIcon,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: appleTouchIcon,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ];
}

/**
 * Validates PWA configuration for common issues
 */
export function validatePWAConfig(config: BlogConfig): string[] {
  const errors: string[] = [];
  const pwa = config.pwa;

  if (!pwa) {
    return ['PWA configuration is missing'];
  }

  if (!pwa.enabled) {
    return ['PWA is disabled'];
  }

  if (!pwa.name && !config.site.name) {
    errors.push('PWA name is required (either pwa.name or site.name)');
  }

  if (!pwa.description && !config.site.description) {
    errors.push('PWA description is required (either pwa.description or site.description)');
  }

  if (!config.branding.logo?.light && !config.branding.favicon) {
    errors.push('At least one icon is required (branding.logo.light or branding.favicon)');
  }

  if (pwa.icons && pwa.icons.length === 0) {
    errors.push('At least one PWA icon is required');
  }

  return errors;
}

/**
 * Helper to check if PWA is enabled and properly configured
 */
export function isPWAEnabled(config: BlogConfig): boolean {
  return !!(config.pwa?.enabled && validatePWAConfig(config).length === 0);
}
