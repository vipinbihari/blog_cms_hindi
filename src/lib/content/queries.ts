import { getCollection } from 'astro:content';
import type { BlogPost, PostsByYear, CategoryStats, TagStats } from '../../types/content';
export type { BlogPost };
import { BLOG_CONFIG } from '../../config/current-config';

/**
 * Compare dates in descending order (newest first)
 */
function compareDesc(dateA: Date, dateB: Date): number {
  return dateB.getTime() - dateA.getTime();
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const allPosts = await getCollection('posts');
    return allPosts.sort((a: BlogPost, b: BlogPost) => compareDesc(a.data.date, b.data.date));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Get featured posts (newest posts)
 */
export async function getFeaturedPosts(limit: number = BLOG_CONFIG.layout.featuredPostsCount ?? 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  // Only get posts that are explicitly marked as featured
  const featuredPosts = allPosts
    .filter(post => post.data.featured === true)
    .sort((a, b) => compareDesc(a.data.date, b.data.date)); // Ensure sorted by date

  // Return only featured posts, limiting to the specified number if there are more
  return featuredPosts.slice(0, limit);
}

/**
 * Get posts by category
 */
/**
 * Get latest posts, excluding a given list of IDs (e.g., already featured posts)
 */
export async function getLatestPosts(limit: number = 3, excludeIds: string[] = []): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(); // Assumes posts are sorted newest first
  
  const latestPosts = allPosts
    .filter(post => !excludeIds.includes(post.id))
    .slice(0, limit);
  
  return latestPosts;
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => 
    post.data.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  );
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => 
    post.data.tags.some(postTag => 
      postTag.toLowerCase().replace(/\s+/g, '-') === tag.toLowerCase()
    )
  );
}

/**
 * Group posts by year for archive views
 */
export async function getPostsByYear(): Promise<PostsByYear> {
  const posts = await getAllPosts();
  const postsByYear: PostsByYear = {};
  
  posts.forEach(post => {
    const year = post.data.date.getFullYear().toString();
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }
    postsByYear[year].push(post);
  });
  
  return postsByYear;
}

/**
 * Get all categories with stats
 */
export async function getCategoryStats(): Promise<CategoryStats[]> {
  const posts = await getAllPosts();
  const categoryMap = new Map<string, { count: number; latestPost?: BlogPost }>();
  
  posts.forEach(post => {
    const category = post.data.category;
    const existing = categoryMap.get(category);
    
    if (existing) {
      existing.count++;
      if (!existing.latestPost || post.data.date > existing.latestPost.data.date) {
        existing.latestPost = post;
      }
    } else {
      categoryMap.set(category, { count: 1, latestPost: post });
    }
  });
  
  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    ...stats,
  }));
}

/**
 * Get all tags with stats
 */
/**
 * Extracts and normalizes keywords from a slug string.
 */
function getSlugKeywords(slug: string): string[] {
  return slug.toLowerCase().split('-').filter(k => k.length > 2); // Filter out very short/common words
}

/**
 * Get related posts based on category, tags, and slug keywords.
 */
export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = BLOG_CONFIG.layout.relatedPostsCount ?? 3
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const currentSlugKeywords = getSlugKeywords(currentPost.slug);

  const scoredPosts = allPosts
    .filter(post => post.id !== currentPost.id) // Exclude the current post itself
    .map(post => {
      let score = 0;

      // 1. Category match (high importance)
      if (post.data.category.toLowerCase() === currentPost.data.category.toLowerCase()) {
        score += 50;
      }

      // 2. Tag match (medium importance, cumulative)
      const commonTags = post.data.tags.filter(tag => 
        currentPost.data.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      );
      score += commonTags.length * 10;

      // 3. Slug keyword match (lower importance, cumulative)
      const postSlugKeywords = getSlugKeywords(post.slug);
      const commonSlugKeywords = postSlugKeywords.filter(keyword => 
        currentSlugKeywords.includes(keyword)
      );
      score += commonSlugKeywords.length * 5;

      return { post, score };
    })
    .filter(scoredPost => scoredPost.score > 0) // Only consider posts with some relevance
    .sort((a, b) => b.score - a.score || compareDesc(a.post.data.date, b.post.data.date)); // Sort by score, then by date

  return scoredPosts.slice(0, limit).map(sp => sp.post);
}


export async function getTagStats(): Promise<TagStats[]> {
  const posts = await getAllPosts();
  const tagMap = new Map<string, BlogPost[]>();
  
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      const existing = tagMap.get(tag);
      if (existing) {
        existing.push(post);
      } else {
        tagMap.set(tag, [post]);
      }
    });
  });
  
  return Array.from(tagMap.entries()).map(([tag, posts]) => ({
    tag,
    count: posts.length,
    posts: posts.sort((a, b) => compareDesc(a.data.date, b.data.date)),
  }));
} 