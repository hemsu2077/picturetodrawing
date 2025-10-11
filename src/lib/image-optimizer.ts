/**
 * Cloudflare Image Resizing Utility
 * 
 * Uses Cloudflare's edge image optimization to resize and optimize images
 * without consuming Vercel server resources.
 * 
 * Docs: https://developers.cloudflare.com/images/image-resizing/
 */

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  quality?: number; // 1-100
  format?: 'auto' | 'webp' | 'avif' | 'json';
  blur?: number; // 1-250 (for blur placeholder)
}

/**
 * Generate Cloudflare Image Resizing URL
 * 
 * @param imageUrl - Original image URL
 * @param options - Resize options
 * @returns Optimized image URL via Cloudflare CDN
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options: ImageResizeOptions = {}
): string {
  // Default options for optimal performance
  const {
    width,
    height,
    fit = 'scale-down',
    quality = 85,
    format = 'auto',
    blur,
  } = options;

  // Build options string
  const params: string[] = [];
  
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  params.push(`fit=${fit}`);
  params.push(`quality=${quality}`);
  params.push(`format=${format}`);
  if (blur) params.push(`blur=${blur}`);

  const optionsString = params.join(',');

  // Cloudflare Image Resizing URL format:
  // https://your-domain.com/cdn-cgi/image/{options}/{image-url}
  
  // Extract the path from the full URL
  const url = new URL(imageUrl);
  const imagePath = url.pathname + url.search;

  return `/cdn-cgi/image/${optionsString}${imagePath}`;
}

/**
 * Preset configurations for common use cases
 */
export const ImagePresets = {
  // Style selector thumbnails (small grid items)
  styleThumbnail: (url: string) =>
    getOptimizedImageUrl(url, {
      width: 200,
      height: 200,
      fit: 'cover',
      quality: 80,
      format: 'auto',
    }),

  // Style preview (larger preview image)
  stylePreview: (url: string) =>
    getOptimizedImageUrl(url, {
      width: 800,
      height: 450,
      fit: 'cover',
      quality: 85,
      format: 'auto',
    }),

  // Sample images
  sampleImage: (url: string) =>
    getOptimizedImageUrl(url, {
      width: 150,
      height: 150,
      fit: 'cover',
      quality: 80,
      format: 'auto',
    }),

  // Blur placeholder (LQIP - Low Quality Image Placeholder)
  blurPlaceholder: (url: string) =>
    getOptimizedImageUrl(url, {
      width: 40,
      height: 40,
      blur: 20,
      quality: 50,
      format: 'auto',
    }),
};

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  imageUrl: string,
  widths: number[] = [200, 400, 800]
): string {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(imageUrl, { width, quality: 85 });
      return `${url} ${width}w`;
    })
    .join(', ');
}
