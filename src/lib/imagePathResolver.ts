/**
 * Image Path Resolver
 * ------------------
 * This helper resolves image paths between the separated content repository and the main codebase.
 * 
 * It handles the structure where:
 * - Content lives in a separate repository
 * - Images are fetched from /content/uploads/ during build
 * - Public image paths are served from /images/uploads/
 */

/**
 * Resolves a content image path to the correct public URL
 * 
 * @param path Path to an image in the content repository 
 * @returns The public URL path for the image
 */
export function resolveContentImagePath(path: string): string {
  // Convert paths like "content/uploads/image-name/file.jpg" to "/images/uploads/image-name/file.jpg"
  if (path.startsWith('content/uploads/')) {
    return path.replace(/^content\/uploads/, '/images/uploads');
  }
  
  // Convert paths like "uploads/image-name/file.jpg" to "/images/uploads/image-name/file.jpg"
  if (path.startsWith('uploads/')) {
    return path.replace(/^uploads/, '/images/uploads');
  }
  
  // For paths already starting with /images/ (including author images), return them as is
  if (path.startsWith('/images/')) {
    return path;
  }
  
  // If path is already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // For any other path without a specific format, assume it's relative to the uploads directory
  // Only happens for legacy content that doesn't follow the current structure
  return `/images/uploads/${path}`;
}

/**
 * Resolves the optimized image path given a source path and target width
 * 
 * @param src Source path of the image
 * @param width Target width of the optimized image
 * @returns The optimized image path
 */
export function getOptimizedImagePath(src: string, width: number) {
  // If the src is already optimized, return as is
  if (src.includes('/images/optimized/')) {
    return src;
  }

  // Remove leading slash if present
  let cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  // Remove leading 'images/' if present to avoid double /images/
  if (cleanSrc.startsWith('images/')) {
    cleanSrc = cleanSrc.slice('images/'.length);
  }

  // Now cleanSrc should be e.g. 'authors/vipin-bihari.webp' or 'uploads/foo.jpg'
  // Build the optimized path
  return `/images/optimized/${cleanSrc.replace(/\.[^.]+$/, '')}-${width}.webp`;
}

