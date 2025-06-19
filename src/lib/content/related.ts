/**
 * Utility to find related posts based on tags, categories, and other metadata
 */

import type { BlogPost } from '../../types/content';
import { BLOG_CONFIG } from '../../config/current-config';

/**
 * Get related posts based on post tags and category
 */
export async function getRelatedPostsLegacy(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = BLOG_CONFIG.layout.relatedPostsCount
): Promise<BlogPost[]> {
  const currentPostTags = currentPost.data.tags;
  const currentPostCategory = currentPost.data.category;
  
  // Calculate relevance score for each post
  const scoredPosts = allPosts
    .filter(post => post.id !== currentPost.id) // Exclude current post
    .map(post => {
      let score = 0;
      
      // Tag matches (each tag match = 1 point)
      const tagMatches = post.data.tags.filter(tag => 
        currentPostTags.includes(tag)
      ).length;
      score += tagMatches;
      
      // Category match (worth 3 points)
      if (post.data.category === currentPostCategory) {
        score += 3;
      }
      
      // Author match (worth 1 point)
      if (post.data.author === currentPost.data.author) {
        score += 1;
      }
      
      // Recency bonus (posts within last 30 days get 1 point)
      const daysDiff = Math.abs(
        post.data.date.getTime() - currentPost.data.date.getTime()
      ) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 30) {
        score += 1;
      }
      
      return { post, score };
    })
    .filter(item => item.score > 0) // Only include posts with at least one match
    .sort((a, b) => {
      // Primary sort by score
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      // Secondary sort by date (newer first)
      return b.post.data.date.getTime() - a.post.data.date.getTime();
    })
    .slice(0, limit)
    .map(item => item.post);
  
  return scoredPosts;
}
