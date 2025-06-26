import { defineCollection, z } from 'astro:content';

/**
 * BLOG CONTENT ARCHITECTURE
 * ------------------------
 * This project uses a separated content architecture:
 * - Blog content (posts and images) lives in a separate repository (/blog_content)
 * - The content repository is fetched during build time into the 'content' directory
 * - GitHub Actions workflow handles fetching the latest content before each build
 * 
 * Directory structure:
 *   - /content/posts - Blog posts in MDX format
 *   - /content/uploads - Blog post images
 * 
 * This allows independent versioning and management of content separate from code.
 * Content updates trigger site rebuilds without changing the main codebase.
 */

// Define external content collection
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    category: z.string(),
    author: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string().optional(),
    featured: z.boolean().optional(),
    quiz: z.array(
      z.object({
        q: z.string(),
        options: z.array(z.string()),
        answer: z.number()
      })
    ).optional()
  })
});

export const collections = {
  'posts': postsCollection
};
