import { BLOG_CONFIG } from '../../config/current-config';

/**
 * Generate placeholder image URL
 */
export function generatePlaceholderImage(
  title: string,
  width: number = 1200,
  height: number = 600
): string {
  const encodedTitle = encodeURIComponent(title.replace(/\s+/g, '+'));
  const service = BLOG_CONFIG.branding.placeholderImageService || 'https://placehold.co';
  return `${service}/${width}x${height}?text=${encodedTitle}`;
}

/**
 * Get responsive image sizes for different breakpoints
 */
export function getResponsiveImageSizes(maxWidth?: number): string {
  if (maxWidth) {
    return `(max-width: 640px) 100vw, (max-width: 1024px) 75vw, ${maxWidth}px`;
  }
  
  return '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw';
}

/**
 * Extract image dimensions from URL (for placeholder images)
 */
export function extractImageDimensions(url: string): { width: number; height: number } | null {
  const match = url.match(/(\d+)x(\d+)/);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
    };
  }
  return null;
}

/**
 * Check if image URL is from a placeholder service
 */
export function isPlaceholderImage(url: string): boolean {
  return url.includes('placehold.co') || 
         url.includes('via.placeholder.com') || 
         url.includes('picsum.photos');
}

/**
 * Generate different image sizes for responsive images
 */
export function generateImageSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280]
): string {
  if (isPlaceholderImage(baseUrl)) {
    // For placeholder images, generate different sizes
    const dimensions = extractImageDimensions(baseUrl);
    if (dimensions) {
      const aspectRatio = dimensions.width / dimensions.height;
      return sizes
        .map(size => {
          const height = Math.round(size / aspectRatio);
          const url = baseUrl.replace(/\d+x\d+/, `${size}x${height}`);
          return `${url} ${size}w`;
        })
        .join(', ');
    }
  }
  
  // For regular images, return the base URL for all sizes
  // In a real implementation, you might have a CDN that can resize images
  return sizes.map(size => `${baseUrl} ${size}w`).join(', ');
}

/**
 * Optimize image loading based on position and content
 */
export function getImageLoadingStrategy(
  isAboveFold: boolean = false,
  isHeroImage: boolean = false
): 'eager' | 'lazy' {
  return (isAboveFold || isHeroImage) ? 'eager' : 'lazy';
}

/**
 * Generate alt text for images based on context
 */
export function generateImageAlt(
  title: string,
  context: 'hero' | 'thumbnail' | 'content' = 'content'
): string {
  switch (context) {
    case 'hero':
      return `Hero image for: ${title}`;
    case 'thumbnail':
      return `Thumbnail for: ${title}`;
    default:
      return title;
  }
} 