# Sample Images for Line Art Tool

This directory contains sample images used in the free photo-to-sketch tool.

## Purpose

These images are stored locally to:
- ✅ **Avoid CORS issues** - No cross-origin restrictions
- ✅ **Reduce server load** - Pure frontend processing
- ✅ **Faster loading** - Served from same domain
- ✅ **Better reliability** - No external CDN dependencies

## Files

- `sample-1.webp` - Portrait sample (10KB)
- `sample-2.webp` - Landscape sample (7KB)
- `sample-3.webp` - Object sample (15KB)
- `sample-4.webp` - Animal sample (19KB)

Total size: ~52KB

## Usage

These images are referenced in:
- `src/components/free-tools/line-art/upload-control.tsx`

## Updating

To update sample images, replace the files in this directory and ensure they are:
- WebP format for optimal size
- Reasonable dimensions (max 1024px)
- Under 50KB each for fast loading
