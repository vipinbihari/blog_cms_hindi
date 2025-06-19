import type { BlogPost, SearchResult } from '../../types/content';
import { getAllPosts } from './queries';

/**
 * Simple text search for posts
 */
export async function searchPosts(query: string): Promise<BlogPost[]> {
  if (!query.trim()) return [];
  
  const posts = await getAllPosts();
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return posts.filter(post => {
    const searchableText = [
      post.data.title,
      post.data.excerpt,
      ...post.data.tags,
      post.data.category,
      post.data.author
    ].join(' ').toLowerCase();
    
    // Post matches if it contains all search terms
    return searchTerms.every(term => searchableText.includes(term));
  });
}

/**
 * Advanced search with scoring
 */
export async function searchPostsWithScore(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const posts = await getAllPosts();
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  const results: SearchResult[] = [];
  
  posts.forEach(post => {
    let score = 0;
    const matches: string[] = [];
    
    // Search in title (highest weight)
    const titleMatches = searchTerms.filter(term => 
      post.data.title.toLowerCase().includes(term)
    );
    if (titleMatches.length > 0) {
      score += titleMatches.length * 3;
      matches.push('title');
    }
    
    // Search in excerpt
    const excerptMatches = searchTerms.filter(term => 
      post.data.excerpt.toLowerCase().includes(term)
    );
    if (excerptMatches.length > 0) {
      score += excerptMatches.length * 2;
      matches.push('excerpt');
    }
    
    // Search in tags
    const tagMatches = searchTerms.filter(term => 
      post.data.tags.some(tag => tag.toLowerCase().includes(term))
    );
    if (tagMatches.length > 0) {
      score += tagMatches.length * 1.5;
      matches.push('tags');
    }
    
    // Search in category
    const categoryMatches = searchTerms.filter(term => 
      post.data.category.toLowerCase().includes(term)
    );
    if (categoryMatches.length > 0) {
      score += categoryMatches.length;
      matches.push('category');
    }
    
    if (score > 0) {
      results.push({ post, score, matches });
    }
  });
  
  // Sort by score (highest first), then by date (newest first)
  return results.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return b.post.data.date.getTime() - a.post.data.date.getTime();
  });
}

/**
 * Get suggestions based on partial query
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (query.length < 2) return [];
  
  const posts = await getAllPosts();
  const suggestions = new Set<string>();
  
  posts.forEach(post => {
    // Add matching tags
    post.data.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(tag);
      }
    });
    
    // Add matching categories
    if (post.data.category.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(post.data.category);
    }
    
    // Add matching title words (for longer words)
    if (query.length >= 3) {
      const titleWords = post.data.title.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.includes(query.toLowerCase()) && word.length > 3) {
          suggestions.add(word);
        }
      });
    }
  });
  
  return Array.from(suggestions).slice(0, limit);
} 