/**
 * Prebuild script that runs before the main Astro build process.
 * Handles preparation tasks for the build, including image optimization setup.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

async function prebuild() {
  try {
    console.log('Running prebuild tasks...');
    
    // Create public directories if they don't exist to avoid build errors
    ensureDirectoryExists(path.resolve(rootDir, 'public'));
    ensureDirectoryExists(path.resolve(rootDir, 'public/images'));
    
    // Create a .nojekyll file to ensure GitHub Pages doesn't process the site with Jekyll
    createNojekyllFile();

    // Ensure the optimized images directory exists
    ensureDirectoryExists(path.resolve(rootDir, 'public/images/optimized'));
    
    console.log('Prebuild tasks completed successfully!');
  } catch (error) {
    console.error('Error during prebuild:', error);
    process.exit(1);
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Creates a .nojekyll file to prevent GitHub Pages from using Jekyll
 */
function createNojekyllFile() {
  const nojekyllPath = path.resolve(rootDir, 'public/.nojekyll');
  if (!fs.existsSync(nojekyllPath)) {
    console.log('Creating .nojekyll file for GitHub Pages');
    fs.writeFileSync(nojekyllPath, '');
  }
}

// No unused functions

prebuild();
