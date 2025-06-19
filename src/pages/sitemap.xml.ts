import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE = import.meta.env.SITE || 'http://localhost:4321'; // fallback for local dev

export const GET: APIRoute = async () => {
  // Get all posts from the collection
  let posts: any[] = [];
  try {
    posts = await getCollection('posts');
  } catch {
    // fallback: no posts collection
    posts = [];
  }

  const staticPages = [
    '',
    'about',
    'categories',
    'tags',
    'contact',
  ];

  const urls = [
    ...staticPages.map((page) => `${SITE}/${page}`),
    ...posts.map((post) => `${SITE}/posts/${post.slug}/`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (url) => `  <url>\n    <loc>${url}</loc>\n  </url>`
    )
    .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
