/**
 * Cloudflare Worker for Image Resizing
 * 
 * This worker intercepts image requests and applies Cloudflare Image Resizing
 * automatically. Deploy this to your Cloudflare Workers for optimal performance.
 * 
 * Setup:
 * 1. Go to Cloudflare Dashboard > Workers & Pages
 * 2. Create a new Worker
 * 3. Paste this code
 * 4. Add route: files.picturetodrawing.com/cdn-cgi/image/*
 * 
 * Pricing: Included in Cloudflare Pro plan or $5/month for 10M requests
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Check if this is an image resize request
    if (!url.pathname.startsWith('/cdn-cgi/image/')) {
      return fetch(request);
    }

    // Parse the image resize options and target URL
    // Format: /cdn-cgi/image/{options}/{image-path}
    const pathParts = url.pathname.split('/cdn-cgi/image/')[1];
    const [options, ...imageParts] = pathParts.split('/');
    const imagePath = '/' + imageParts.join('/');

    // Parse options (e.g., "width=200,height=200,fit=cover,quality=85,format=auto")
    const optionsObj = {};
    options.split(',').forEach(opt => {
      const [key, value] = opt.split('=');
      optionsObj[key] = value;
    });

    // Build the original image URL
    const imageUrl = new URL(imagePath + url.search, url.origin);

    // Fetch the image with Cloudflare Image Resizing
    const resizeOptions = {
      cf: {
        image: {
          width: parseInt(optionsObj.width) || undefined,
          height: parseInt(optionsObj.height) || undefined,
          fit: optionsObj.fit || 'scale-down',
          quality: parseInt(optionsObj.quality) || 85,
          format: optionsObj.format || 'auto',
          blur: parseInt(optionsObj.blur) || undefined,
        }
      }
    };

    try {
      const response = await fetch(imageUrl.toString(), resizeOptions);
      
      // Clone the response to add cache headers
      const newResponse = new Response(response.body, response);
      
      // Add aggressive caching for optimized images
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      newResponse.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
      
      return newResponse;
    } catch (error) {
      // Fallback to original image if resizing fails
      return fetch(imageUrl.toString());
    }
  }
};
