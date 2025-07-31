/**
 * Image optimization script for blog_cms
 * Processes images in public/images/uploads and creates optimized versions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { BLOG_CONFIG } from '../config/current-config.ts';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const uploadsDir = path.resolve(rootDir, 'public/images/uploads');
const optimizedDir = path.resolve(rootDir, 'public/images/optimized');

// Get configuration from central config
const getImageConfig = () => {
  const config = BLOG_CONFIG.imageResolutions;
  
  // Build width breakpoints from config
  const widths = [config.card, config.content, config.zoom];
  
  // Add additional resolutions if specified
  if (config.additional && config.additional.length > 0) {
    widths.push(...config.additional);
  }
  
  // Remove duplicates and sort
  const uniqueWidths = [...new Set(widths)].sort((a, b) => a - b);
  
  // Get quality settings with defaults
  const quality = {
    webp: config.quality?.webp || 80,
    jpg: config.quality?.jpg || 80,
    jpeg: config.quality?.jpeg || 80,
    png: config.quality?.png || 80
  };
  
  return {
    widths: uniqueWidths,
    formats: config.formats,
    quality
  };
};

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
    const sourceFormat = ext.replace('.', '');
    
    // Get image configuration
    const imageConfig = getImageConfig();
    
    // Get the smallest width (card size) to check for existence
    const checkWidth = Math.min(...imageConfig.widths);
    
    // Check if at least one optimized version exists for each configured format
    let hasAnyOptimizedVersion = false;
    
    for (const format of imageConfig.formats) {
      let outputFormat = format;
      if (format === 'original') {
        outputFormat = sourceFormat;
      }
      
      // Skip unsupported formats
      if (!['webp', 'jpg', 'jpeg', 'png'].includes(outputFormat)) {
        continue;
      }
      
      const outputExt = outputFormat === 'jpeg' ? '.jpg' : `.${outputFormat}`;
      const optimizedPath = path.join(targetDir, `${fileName}-${checkWidth}${outputExt}`);
      
      if (fs.existsSync(optimizedPath)) {
        hasAnyOptimizedVersion = true;
        
        // Check if source is newer than this optimized version
        const optimizedStats = fs.statSync(optimizedPath);
        if (sourceTime > optimizedStats.mtimeMs) {
          return true; // Source is newer, need to reprocess
        }
      }
    }
    
    // If no optimized versions exist, we need to process
    if (!hasAnyOptimizedVersion) {
      return true;
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
    const sourceFormat = ext.replace('.', '');
    const fileName = path.basename(filePath, ext);
    const targetDir = path.join(optimizedDir, path.dirname(relativePath));
    
    // Get image configuration
    const imageConfig = getImageConfig();
    
    // Create target directory
    ensureDirectoryExists(targetDir);
    
    // Create base Sharp instance
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Determine widths to generate (don't generate larger than original)
    const widths = imageConfig.widths.filter(w => w <= metadata.width);
    if (widths.length === 0) widths.push(metadata.width);
    
    // Track optimized versions
    const optimizedVersions = [];
    const originalSize = fs.statSync(filePath).size;
    
    // Generate images for each configured format
    for (const format of imageConfig.formats) {
      // Determine the actual format to use
      let outputFormat = format;
      if (format === 'original') {
        outputFormat = sourceFormat;
      }
      
      // Skip if format is not supported
      if (!['webp', 'jpg', 'jpeg', 'png'].includes(outputFormat)) {
        console.warn(`Skipping unsupported format: ${outputFormat}`);
        continue;
      }
      
      // Generate images at each width
      for (const width of widths) {
        const outputExt = outputFormat === 'jpeg' ? '.jpg' : `.${outputFormat}`;
        const outputPath = path.join(targetDir, `${fileName}-${width}${outputExt}`);
        
        try {
          const outputInfo = await image
            .resize(width)
            .toFormat(outputFormat, { quality: imageConfig.quality[outputFormat] || 80 })
            .toFile(outputPath);
          
          // Calculate compression ratio
          const compressionRatio = (originalSize / outputInfo.size).toFixed(2);
          
          console.log(`Optimized: ${outputPath} (${outputInfo.size} bytes, ${compressionRatio}x smaller) [${outputFormat.toUpperCase()}]`);
          
          // Track this optimized version
          optimizedVersions.push({
            width,
            format: outputFormat,
            path: path.relative(rootDir, outputPath),
            size: outputInfo.size,
            compressionRatio: parseFloat(compressionRatio)
          });
        } catch (formatError) {
          console.error(`Error generating ${outputFormat} format for ${outputPath}:`, formatError.message);
        }
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
