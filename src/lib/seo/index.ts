import type { BlogPost } from '../../types/content';
import { BLOG_CONFIG } from '../../config/current-config';

/**
 * Generate Open Graph image URL
 */
export function generateOgImageUrl(
  title: string, 
  image?: string
): string {
  if (image) {
    // Check if the image URL is already absolute
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // If relative (starts with '/'), prepend the site URL. Otherwise, assume it's a full URL or handle as error/default.
    if (image.startsWith('/')) {
      return `${BLOG_CONFIG.site.url.replace(/\/$/, '')}${image}`;
    }
    // Fallback for unexpected image format, or could return a default site OG image
    // For now, let's return the image as is if it's not starting with / and not absolute, 
    // or consider returning the placeholder.
    // However, the primary case from PostLayout will be a relative path starting with / or an absolute one.
  }

  
  const encodedTitle = encodeURIComponent(title.replace(/\s+/g, '+'));
  return `https://placehold.co/1200x630?text=${encodedTitle}`;
}

/**
 * Generate post URL
 */
export function generatePostUrl(slug: string): string {
  return `${BLOG_CONFIG.site.url}posts/${slug}/`;
}

/**
 * Generate category URL
 */
export function generateCategoryUrl(category: string): string {
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  return `${BLOG_CONFIG.site.url}categories/${categorySlug}/`;
}

/**
 * Generate tag URL
 */
export function generateTagUrl(tag: string): string {
  const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
  return `${BLOG_CONFIG.site.url}tags/${tagSlug}/`;
}

/**
 * Create structured data for blog post
 */
export function generatePostStructuredData(post: BlogPost, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.excerpt,
    image: post.data.heroImage || generateOgImageUrl(post.data.title),
    author: {
      '@type': 'Person',
      name: post.data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: BLOG_CONFIG.site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${BLOG_CONFIG.site.url}logo.png`,
      },
    },
    datePublished: post.data.date.toISOString(),
    dateModified: post.data.date.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.data.tags.join(', '),
    articleSection: post.data.category,
  };
}

/**
 * Generate meta description from excerpt
 */
export function generateMetaDescription(
  excerpt: string, 
  maxLength: number = 160
): string {
  if (excerpt.length <= maxLength) return excerpt;
  
  const truncated = excerpt.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Generate page title with site name
 */
export function generatePageTitle(
  title: string, 
  includesSiteName: boolean = true
): string {
  if (!includesSiteName) return title;
  return `${title} | ${BLOG_CONFIG.site.name}`;
}

/**
 * Extract keywords from post content
 */
export function extractKeywords(post: BlogPost): string[] {
  const keywords = new Set<string>();
  
  // Add tags
  post.data.tags.forEach(tag => keywords.add(tag));
  
  // Add category
  keywords.add(post.data.category);
  
  // Extract important words from title (simple approach)
  const titleWords = post.data.title
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3 && !isStopWord(word));
  
  titleWords.forEach(word => keywords.add(word));
  
  return Array.from(keywords);
}

/**
 * Simple stop words list for keyword extraction
 */
function isStopWord(word: string): boolean {
  const stopWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'how', 
    'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
    'its', 'let', 'put', 'say', 'she', 'too', 'use'
  ];
  
  return stopWords.includes(word.toLowerCase());
} 