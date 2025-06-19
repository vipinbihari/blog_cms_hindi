import type { PaginationResult } from '../../types/content';
import { BLOG_CONFIG } from '../../config/current-config';

/**
 * Paginate an array of items
 */
export function paginate<T>(
  items: T[], 
  currentPage: number = 1, 
  itemsPerPage: number = BLOG_CONFIG.layout.postPerPage
): PaginationResult<T> {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    data: items.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

/**
 * Generate pagination URLs for Astro static paths
 */
export function generatePaginationPaths<T>(
  items: T[],
  itemsPerPage: number = BLOG_CONFIG.layout.postPerPage,
  basePath: string = '/posts/page'
) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paths = [];
  
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    paths.push({
      params: { page: page.toString() },
      props: {
        posts: items.slice(startIndex, endIndex),
        pagination: {
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          nextUrl: page < totalPages ? `${basePath}/${page + 1}` : null,
          prevUrl: page > 1 ? `${basePath}/${page - 1}` : null,
        }
      }
    });
  }
  
  return paths;
}

/**
 * Generate page numbers for pagination display
 */
export function generatePageNumbers(
  currentPage: number, 
  totalPages: number, 
  maxVisible: number = 5
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const sidePages = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - sidePages);
  let endPage = Math.min(totalPages, currentPage + sidePages);
  
  // Adjust if we're near the beginning or end
  if (endPage - startPage + 1 < maxVisible) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisible - 1);
    } else {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
} 