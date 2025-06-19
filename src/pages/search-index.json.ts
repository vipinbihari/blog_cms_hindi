import { getCollection, type CollectionEntry } from 'astro:content';

export const prerender = true; // emit as static file during build

type BlogPost = CollectionEntry<'posts'>;

/**
 * Build-time endpoint that generates `dist/search-index.json`.
 * Can be fetched client-side for instant, fully static search.
 */
export async function GET() {
  const posts = await getCollection('posts');

  const index = posts.map((post: BlogPost) => ({
    slug: `/posts/${post.slug}/`,
    title: post.data.title,
    excerpt: post.data.excerpt ?? '',
    tags: post.data.tags,
    category: post.data.category,
    date: post.data.date,
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
