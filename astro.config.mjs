import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
// Add sharp for image processing
import { fileURLToPath } from 'url';
import { BLOG_CONFIG } from './src/config/current-config.ts';

// https://astro.build/config
export default defineConfig({
  // Replace this with your GitHub username and repository name
  // Format: https://<username>.github.io/<repository-name>
  site: BLOG_CONFIG.site.url, // Dynamically set from current-config.ts
  // If you plan to deploy to a subfolder, add base with the subfolder path
  // base: '/YOUR_REPOSITORY_NAME',
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      config: { path: './tailwind.config.mjs' },
    }),
    react(),
  ],
  // Content collections are now standard (no longer experimental)
  // Output as static site for GitHub Pages
  output: 'static',
  // Configure image optimization for build time processing
  image: {
    // Use sharp for better image processing
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // Image optimization quality settings
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        png: { quality: 80 },
        webp: { quality: 80 },
        avif: { quality: 80 },
      },
    },
    // Allow specific domains for remote images
    domains: ['placehold.co', 'via.placeholder.com', 'picsum.photos'],
    // Allow images from specific patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
});
