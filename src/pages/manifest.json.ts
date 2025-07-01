/**
 * PWA Manifest.json Endpoint
 * --------------------------
 * PURPOSE
 *   Dynamically generates web app manifest from blog configuration
 *   Enables PWA install prompts and homescreen installation
 * 
 * USAGE
 *   Automatically served at /manifest.json
 *   Referenced in HTML head via link tag
 */

import type { APIRoute } from 'astro';
import { BLOG_CONFIG } from '../config/current-config';
import { generateManifest, isPWAEnabled } from '../lib/pwa/manifest';

export const GET: APIRoute = async () => {
  try {
    // Check if PWA is enabled in the configuration
    if (!isPWAEnabled(BLOG_CONFIG)) {
      return new Response(
        JSON.stringify({ 
          error: 'PWA is not enabled or properly configured' 
        }), 
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Generate the manifest from configuration
    const manifest = generateManifest(BLOG_CONFIG);

    return new Response(
      JSON.stringify(manifest, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/manifest+json',
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      }
    );
  } catch (error) {
    console.error('Error generating PWA manifest:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate PWA manifest',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
