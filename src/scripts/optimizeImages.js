/**
 * Image optimization script for blog_cms_hindi
 * Processes images in public/images/uploads and creates optimized versions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const uploadsDir = path.resolve(rootDir, 'public/images/uploads');
const optimizedDir = path.resolve(rootDir, 'public/images/optimized');

// Quality settings for different formats
const QUALITY_SETTINGS = {
  jpeg: 80,
  jpg: 80,
  png: 80,
  webp: 75
};

// Width breakpoints for responsive images
const WIDTH_BREAKPOINTS = [320, 640, 960, 1280, 1920];

// File to store timestamps for optimized images
const timestampFile = path.resolve(rootDir, 'public/images/optimized/.timestamps.json');

/**
 * Main optimization function
 */
async function optimizeImages() {
  try {
    console.log('Starting image optimization...');
    
    // Create the optimized directory if it doesn't exist
    ensureDirectoryExists(optimizedDir);
    
    // Process all images in uploads directory, comparing with existing optimized versions
    const newImagesCount = await processDirectory(uploadsDir, '');
    
    if (newImagesCount > 0) {
      console.log(`Processed ${newImagesCount} new or modified images.`);
    } else {
      console.log('No new or modified images to process.');
    }
    
    console.log('Image optimization completed successfully!');
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

/**
 * Process all images in a directory recursively
 * @returns {number} Count of newly processed images
 */
async function processDirectory(dirPath, relativePath) {
  let newImagesCount = 0;
  
  // Get all files in the directory
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    const fileRelativePath = path.join(relativePath, file.name);
    
    if (file.isDirectory()) {
      // Process subdirectories recursively
      newImagesCount += await processDirectory(filePath, fileRelativePath);
    } else {
      // Check if it's an image file
      const ext = path.extname(file.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const fileName = path.basename(file.name, ext);
        const targetDir = path.join(optimizedDir, path.dirname(fileRelativePath));
        const needsProcessing = doesImageNeedProcessing(filePath, fileName, ext, targetDir);
        
        if (needsProcessing) {
          await optimizeImage(filePath, fileRelativePath);
          newImagesCount++;
        } else {
          console.log(`Skipping already optimized image: ${fileRelativePath}`);
        }
      }
    }
  }
  
  return newImagesCount;
}

/**
 * Determines if an image needs to be processed by checking if optimized versions
 * already exist and are newer than the source file
 * @param {string} sourceFilePath - Path to the source image file
 * @param {string} fileName - Base name of the file without extension
 * @param {string} ext - File extension including the dot
 * @param {string} targetDir - Directory where optimized versions would be stored
 * @returns {boolean} True if the image needs processing, false otherwise
 */
function doesImageNeedProcessing(sourceFilePath, fileName, ext, targetDir) {
  try {
    const sourceStats = fs.statSync(sourceFilePath);
    const sourceTime = sourceStats.mtimeMs;
    
    // Check if at least one of the optimized versions exists
    // We'll check the smallest size (320px) as it should always be generated
    const optimizedPath = path.join(targetDir, `${fileName}-320${ext}`);
    const webpPath = path.join(targetDir, `${fileName}-320.webp`);
    
    // If neither optimized version exists, we need to process the image
    if (!fs.existsSync(optimizedPath) && !fs.existsSync(webpPath)) {
      return true;
    }
    
    // If optimized version exists, check if source is newer
    if (fs.existsSync(optimizedPath)) {
      const optimizedStats = fs.statSync(optimizedPath);
      if (sourceTime > optimizedStats.mtimeMs) {
        return true; // Source is newer, need to reprocess
      }
    }
    
    // If WebP version exists, check if source is newer
    if (fs.existsSync(webpPath)) {
      const webpStats = fs.statSync(webpPath);
      if (sourceTime > webpStats.mtimeMs) {
        return true; // Source is newer, need to reprocess
      }
    }
    
    // If we got here, optimized versions exist and are up to date
    return false;
  } catch (error) {
    console.error(`Error checking if image needs processing: ${error.message}`);
    // On error, assume we need to process the image
    return true;
  }
}

/**
 * Optimize a single image
 * @param {string} filePath - Absolute path to the image file
 * @param {string} relativePath - Relative path within the uploads directory
 * @returns {Object} Information about the optimized versions created
 */
async function optimizeImage(filePath, relativePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const imageType = ext.replace('.', '');
    const fileName = path.basename(filePath, ext);
    const targetDir = path.join(optimizedDir, path.dirname(relativePath));
    
    // Create target directory
    ensureDirectoryExists(targetDir);
    
    // Create base Sharp instance
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Determine widths to generate (don't generate larger than original)
    const widths = WIDTH_BREAKPOINTS.filter(w => w <= metadata.width);
    if (widths.length === 0) widths.push(metadata.width);
    
    // Track optimized versions
    const optimizedVersions = [];
    
    // Output original format
    for (const width of widths) {
      const outputPath = path.join(targetDir, `${fileName}-${width}${ext}`);
      const outputInfo = await image
        .resize(width)
        .toFormat(imageType, { quality: QUALITY_SETTINGS[imageType] || 80 })
        .toFile(outputPath);
      
      // Calculate compression ratio
      const originalSize = fs.statSync(filePath).size;
      const compressionRatio = (originalSize / outputInfo.size).toFixed(2);
      
      console.log(`Optimized: ${outputPath} (${outputInfo.size} bytes, ${compressionRatio}x smaller)`);
      
      // Track this optimized version
      optimizedVersions.push({
        width,
        format: imageType,
        path: path.relative(rootDir, outputPath),
        size: outputInfo.size,
        compressionRatio: parseFloat(compressionRatio)
      });
    }
    
    // Also output WebP format for better compression
    if (imageType !== 'webp') {
      for (const width of widths) {
        const outputPath = path.join(targetDir, `${fileName}-${width}.webp`);
        const outputInfo = await image
          .resize(width)
          .toFormat('webp', { quality: QUALITY_SETTINGS.webp })
          .toFile(outputPath);
        
        // Calculate compression ratio
        const originalSize = fs.statSync(filePath).size;
        const compressionRatio = (originalSize / outputInfo.size).toFixed(2);
        
        console.log(`Optimized: ${outputPath} (${outputInfo.size} bytes, ${compressionRatio}x smaller) (WebP)`);
        
        // Track this optimized version
        optimizedVersions.push({
          width,
          format: 'webp',
          path: path.relative(rootDir, outputPath),
          size: outputInfo.size,
          compressionRatio: parseFloat(compressionRatio)
        });
      }
    }
    
    
    return optimizedVersions;
  } catch (error) {
    console.error(`Error optimizing image ${filePath}:`, error);
    return [];
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// No tracking functions needed with timestamp-based approach

// Run optimization
optimizeImages();
