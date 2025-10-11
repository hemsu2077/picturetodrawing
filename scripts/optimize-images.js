/**
 * Image Pre-optimization Script
 * 
 * This script pre-generates optimized versions of images for different use cases.
 * Use this if you don't want to pay for Cloudflare Image Resizing.
 * 
 * Requirements:
 *   npm install sharp
 * 
 * Usage:
 *   node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const SIZES = {
  thumbnail: { width: 200, height: 200, quality: 80 },
  preview: { width: 800, height: 450, quality: 85 },
  sample: { width: 150, height: 150, quality: 80 },
};

/**
 * Optimize a single image
 */
async function optimizeImage(inputUrl, outputPath, size) {
  try {
    console.log(`Optimizing ${inputUrl} -> ${outputPath}`);
    
    // Download image if it's a URL
    let imageBuffer;
    if (inputUrl.startsWith('http')) {
      const response = await fetch(inputUrl);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      imageBuffer = fs.readFileSync(inputUrl);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Optimize with sharp
    await sharp(imageBuffer)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: size.quality })
      .toFile(outputPath);

    console.log(`✅ Optimized: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputUrl}:`, error.message);
  }
}

/**
 * Main optimization function
 */
async function main() {
  console.log('🚀 Starting image optimization...\n');

  // Example: Optimize style images
  const styleImages = [
    'https://files.picturetodrawing.com/styles/pencil-sketch.webp',
    'https://files.picturetodrawing.com/styles/line-drawing.webp',
    // Add all your style images here
  ];

  const sampleImages = [
    'https://files.picturetodrawing.com/sample/sample-1.webp',
    'https://files.picturetodrawing.com/sample/sample-2.webp',
    'https://files.picturetodrawing.com/sample/sample-3.webp',
    'https://files.picturetodrawing.com/sample/sample-4.webp',
  ];

  // Optimize style thumbnails
  console.log('📸 Optimizing style thumbnails...');
  for (const url of styleImages) {
    const filename = path.basename(url);
    const outputPath = path.join(__dirname, '../public/optimized/thumbnails', filename);
    await optimizeImage(url, outputPath, SIZES.thumbnail);
  }

  // Optimize sample images
  console.log('\n📸 Optimizing sample images...');
  for (const url of sampleImages) {
    const filename = path.basename(url);
    const outputPath = path.join(__dirname, '../public/optimized/samples', filename);
    await optimizeImage(url, outputPath, SIZES.sample);
  }

  console.log('\n✅ All images optimized!');
  console.log('\n📝 Next steps:');
  console.log('1. Upload optimized images to Cloudflare R2');
  console.log('2. Update image URLs in your code to use optimized versions');
  console.log('3. Or use the local optimized images from /public/optimized/');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, SIZES };
