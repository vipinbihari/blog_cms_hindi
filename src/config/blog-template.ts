/**
 * Blog Template Configuration System
 * ----------------------------------
 * PURPOSE
 *   • Provides TypeScript _types only_ (no real data) that describe the shape of the blog configuration.
 *   • Offers design-token helpers such as THEME_PRESETS that can be reused by any concrete configuration.
 *
 * HOW TO WORK WITH THIS FILE
 *   1. Need a new setting? ✅  Extend the relevant interface below.
 *   2. Populate that setting with real values in `current-config.ts`.
 *   3. Compile / run the dev server and let TypeScript guide you to any places that now require an update.
 *
 * NOTE
 *   This file deliberately contains _no live content_. Keep URLs, titles, copy, etc. in `current-config.ts`.
 */

export interface HeroConfigImage {
  src: string;
  alt: string;
}

export interface HeroCtaButton {
  text: string;
  url: string;
}

export interface HeroBackgroundImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface HeroConfig {
  title?: string;
  subtitle?: string;
  ctaButton1?: HeroCtaButton;
  ctaButton2?: HeroCtaButton;
  image?: HeroConfigImage;
  showImage?: boolean;
  heroBackgroundImage?: string | HeroBackgroundImage;
}

/**
 * Image Resolutions Configuration
 * Defines standard image sizes used throughout the blog for consistency
 */
export interface ImageResolutionsConfig {
  /**
   * Width for post card thumbnails (e.g., on homepage, category listings)
   * Default: 320px
   */
  card: number;
  
  /**
   * Width for blog post content images
   * Default: 640px 
   */
  content: number;
  
  /**
   * Width for zoomed/fullscreen images
   * Default: 960px
   */
  zoom: number;
  
  /**
   * Additional custom resolutions (optional)
   * Use this to add extra breakpoints beyond the standard card/content/zoom sizes
   */
  additional?: number[];
  
  /**
   * Image formats to generate during optimization
   * Default: ['webp', 'original'] - generates WebP versions plus keeps original format
   * Options: 'webp', 'jpg', 'jpeg', 'png', 'original'
   * 'original' means keep the same format as the source image
   */
  formats: ('webp' | 'jpg' | 'jpeg' | 'png' | 'original')[];
  
  /**
   * Quality settings for each format (0-100)
   * Default: 80 for all formats
   */
  quality?: {
    webp?: number;
    jpg?: number;
    jpeg?: number;
    png?: number;
  };
}

export interface BlogConfig {
  // Site Identity
  site: {
    name: string;
    tagline: string;
    description: string;
    url: string;
    author: string;
    email: string;
    language: string;
    locale: string;
  };
  
  // Branding & Visual Identity
  branding: {
    logo?: {
      light: string;
      dark?: string;
      alt: string;
      width?: number;
      height?: number;
    };
    favicon: string;
    ogImage: string;
    appleTouchIcon?: string;
    placeholderImageService?: string;
  };
  
  // Theme Configuration
  theme: {
    colors: {
      primary: ColorScale;
      secondary: ColorScale;
    };
    typography: {
      fontFamily: {
        sans: string[];
        serif?: string[];
        mono?: string[];
      };
      fontSizes: {
        base: string;
        headings: {
          h1: string;
          h2: string;
          h3: string;
          h4: string;
        };
      };
    };
    spacing: {
      container: string;
      section: string;
    };
    darkMode?: boolean;
  };
  
  // Layout & Navigation
  layout: {
    postPerPage: number;
    featuredPostsCount?: number; // Number of featured posts to fetch
    relatedPostsCount?: number; // Number of related posts to show on a post page
    latestPostsOnHomepage?: number; // Number of latest posts to show on the homepage
    breadcrumbSeparator?: string;
    heroConfig?: HeroConfig; // Configuration for the homepage hero section
  };
  navigation: {
    header: NavigationItem[];
    footer: FooterSection[];
    // Social links are now managed globally via the top-level BLOG_CONFIG.social array
  };
  footer: {
    copyright?: string;
  };
  
  // Post Configuration
  // Social Media & Integrations
  social: SocialLink[];
  
  // Component Configurations
  upstoxCTA?: UpstoxCTAConfig; // Configuration for the UpstoxCTA component
  authors?: Record<string, AuthorData>; // Configuration for author information
  imageResolutions: ImageResolutionsConfig; // Configuration for standardized image resolutions
  
  // SEO & Advanced
  seo?: {
    defaultTitle: string;
    titleTemplate: string;
    robotsDirectives?: string[];
    twitterHandle?: string;
  };
  
  aboutPage?: AboutPageConfig; // Optional configuration for the About Us page
  contactPage?: ContactPageConfig; // Optional configuration for the Contact page
  legalPages: LegalPagesConfig; // Required configuration for legal pages
  
  // PWA Configuration
  pwa?: PWAConfig; // Optional Progressive Web App configuration
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'facebook' | 'instagram' | 'youtube' | 'discord' | 'custom';
  url: string;
  label: string;
  icon?: string;
}

// Contact Page Configuration
interface ContactPageConfig {
  title: string;
  description: string;
  email: {
    name: string;
    address: string;
    icon?: string;
  };
  phone: {
    name: string;
    number: string;
    formattedNumber: string;
    icon?: string;
  };
  address: {
    name: string;
    location: string;
    icon?: string;
  };
  businessHours: {
    title: string;
    hours: Array<{
      days: string;
      hours: string;
    }>;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// New interfaces for About Page content
interface AboutPageCtaButton {
  text: string;
  href: string;
  style?: 'primary' | 'secondary' | 'outline'; // Style for different button appearances
}

interface AboutPageSectionText {
  title: string;
  content: string; // Can include simple HTML for formatting if needed
}

interface AboutPageHeroSection {
  headline: string; // Can include HTML for spans, e.g., "Text <span class='...'>Emphasized</span>"
  subheadline: string;
  ctaButton: AboutPageCtaButton;
}

interface AboutPageMissionSection {
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
}

interface AboutPageOfferItem {
  icon: string; // Could be emoji or SVG path
  title: string;
  description: string;
}

interface AboutPageTeamMember {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  // socialLinks?: SocialLink[]; // Future enhancement
}

interface AboutPageValue {
  icon: string; // Could be emoji or SVG path
  name: string;
  description: string;
}

export interface AboutPageConfig {
  title: string; // SEO Title for the about page
  description: string;
  hero?: AboutPageHeroSection;
  mission?: AboutPageMissionSection;
  whoWeAre?: AboutPageSectionText;
  whatWeOffer?: {
    title: string;
    items: AboutPageOfferItem[];
  };
  values?: {
    title: string;
    items: AboutPageValue[];
  };
  team?: {
    title: string;
    members: AboutPageTeamMember[];
  };
  callToAction?: {
    headline: string;
    subheadline: string;
    buttons: AboutPageCtaButton[];
  };
}

// UpstoxCTA Component Configuration
export interface UpstoxCTAConfig {
  enabled: boolean; // Whether to show the component
  title: string;
  logo: {
    src: string;
    alt: string;
  };
  badge?: {
    text: string;
    showBadge: boolean;
  };
  description: string;
  features: string[];
  ctaSection: {
    title: string;
    buttonText: string;
    buttonUrl: string;
    disclaimer?: string;
  };
}

// PWA Configuration
export interface PWAConfig {
  enabled: boolean;
  name: string;
  shortName: string;
  description: string;
  // Optional theme colors - if undefined, will use theme.colors.primary
  themeColor?: string;
  backgroundColor?: string;
  display: 'minimal-ui' | 'standalone' | 'fullscreen' | 'browser';
  orientation: 'any' | 'natural' | 'landscape' | 'portrait';
  scope: string;
  startUrl: string;
  // Icons can be an array or 'auto' to generate from branding config
  icons: {
    src: string;
    sizes: string;
    type: string;
    purpose?: 'any' | 'maskable' | 'monochrome';
  }[] | 'auto';
  categories?: string[];
  // Shortcuts can be an array or 'auto' to generate from navigation config
  shortcuts?: {
    name: string;
    url: string;
    description?: string;
    icon?: string;
  }[] | 'auto';
  screenshots?: {
    src: string;
    sizes: string;
    type: string;
    label?: string;
  }[];
}

// Author Configuration
export interface AuthorData {
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  website?: string;
}

// Legal Pages Configuration
export interface LegalPagesConfig {
  privacy: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  terms: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  disclaimer: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

// Pre-built theme configurations
export const THEME_PRESETS = {
  teal: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
    secondary: {
      50: '#f1f5f9',
      100: '#e2e8f0',
      200: '#cbd5e1',
      300: '#94a3b8',
      400: '#64748b',
      500: '#475569',
      600: '#334155',
      700: '#1e293b',
      800: '#0f172a',
      900: '#020617',
      950: '#000c13',
    }
  },
  blue: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  green: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    secondary: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },
  },
  purple: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21b6',
      900: '#581c87',
      950: '#3b0764',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
  },
  orange: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    secondary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
  },
} as const;

// Export current configuration (this will be the active config)
export { BLOG_CONFIG } from './current-config';
