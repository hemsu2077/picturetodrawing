"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { ProcessingProgress } from "./processing-progress";

// Global type for the UMD build loaded from CDN
declare global {
  interface Window {
    heic2any?: any;
  }
}

interface UploadControlProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  className?: string;
}

// Sample images for quick testing (local files, no CORS issues)
const SAMPLE_IMAGES = [
  '/imgs/samples/sample-1.webp',
  '/imgs/samples/sample-2.webp',
  '/imgs/samples/sample-3.webp',
  '/imgs/samples/sample-4.webp',
];

export function UploadControl({
  onFileSelect,
  selectedFile,
  onClearFile,
  className,
}: UploadControlProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const MAX_DIM = 1024;

  const loadImageFromUrl = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const downscaleIfNeeded = async (
    file: File,
    maxDim: number = MAX_DIM,
    outputType: string = "image/jpeg",
    quality: number = 0.92
  ): Promise<File> => {
    // Create object URL to read dimensions
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImageFromUrl(url);
      const origW = img.naturalWidth || (img as any).width;
      const origH = img.naturalHeight || (img as any).height;
      const maxSide = Math.max(origW, origH);

      // No resize needed
      if (maxSide <= maxDim) {
        return file;
      }

      const scale = maxDim / maxSide;
      const W = Math.max(1, Math.round(origW * scale));
      const H = Math.max(1, Math.round(origH * scale));

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, W, H);

      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          outputType,
          quality
        )
      );

      const outName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], outName, { type: outputType });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const isHeicLike = (file: File) => {
    const type = (file.type || "").toLowerCase();
    const name = (file.name || "").toLowerCase();
    return (
      type.includes("heic") ||
      type.includes("heif") ||
      /\.(heic|heif)$/.test(name)
    );
  };

  const loadHeic2Any = async (): Promise<any | null> => {
    if (typeof window === "undefined") return null;
    if (window.heic2any) return window.heic2any;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load heic2any"));
      document.head.appendChild(script);
    });
    return window.heic2any || null;
  };

  const revokePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const processSelectedFile = async (file: File) => {
    // Revoke previous preview (if any)
    revokePreview();

    if (!file) return;

    // If not HEIC/HEIF, pass through directly
    try {
      setIsConverting(true);
      setPreviewUrl(null);

      if (!isHeicLike(file)) {
        // For non-HEIC: downscale if needed (output JPEG to keep consistent)
        const downsized = await downscaleIfNeeded(file, MAX_DIM, "image/jpeg", 0.92);
        onFileSelect(downsized);
        const url = URL.createObjectURL(downsized);
        setPreviewUrl(url);
        return;
      }

      // Convert HEIC/HEIF to JPEG first
      const heic2any = await loadHeic2Any();
      if (!heic2any) throw new Error("heic2any is not available");
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.92,
      });
      const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
      const jpegFile = new File(
        [convertedBlob],
        file.name.replace(/\.(heic|heif)$/i, ".jpg"),
        { type: "image/jpeg" }
      );

      // Then downscale if needed
      const downsized = await downscaleIfNeeded(jpegFile, MAX_DIM, "image/jpeg", 0.92);
      onFileSelect(downsized);
      const url = URL.createObjectURL(downsized);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Image processing failed:", error);
      alert(
        "Image processing failed. Please try another image (JPEG/PNG/WebP/HEIC)."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) await processSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleSampleSelect = async (sampleUrl: string) => {
    try {
      // Fetch local sample image (no CORS issues, no server load)
      const response = await fetch(sampleUrl, {
        cache: 'force-cache',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      const fileName = sampleUrl.split('/').pop() || 'sample.webp';
      const file = new File([blob], fileName, { type: blob.type || 'image/webp' });

      // Ensure same processing pipeline (downscale if needed)
      await processSelectedFile(file);
    } catch (error) {
      console.error('Failed to load sample image:', error);
      alert('Failed to load sample image. Please try again.');
    }
  };

  const handleClear = () => {
    revokePreview();
    onClearFile();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleFileChange}
        className="hidden"
      />

      {isConverting ? (
        <ProcessingProgress className="flex-1" />
      ) : selectedFile ? (
        <div className="relative w-full flex-1 rounded-lg overflow-hidden border bg-muted/30">
          {previewUrl && (
            <NextImage
              src={previewUrl}
              alt="Uploaded preview"
              fill
              className="object-contain"
              unoptimized
            />
          )}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 border shadow-sm h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors flex-1 flex flex-col justify-center",
            isDragging && "border-primary bg-accent/20"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Upload area */}
          <div 
            className="flex flex-col items-center gap-2 text-center cursor-pointer"
            onClick={openFileDialog}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-md font-medium mb-0.5">Upload your photo</div>
              <div className="text-sm text-muted-foreground">
                Click to browse or drag and drop
              </div>
            </div>
          </div>

          {/* Sample images inside upload area */}
          <div className="mt-4 pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
              Or try with sample pictures:
            </p>
            <div className="flex gap-2 justify-center">
              {SAMPLE_IMAGES.map((sampleUrl, index) => (
                <div
                  key={index}
                  className="relative w-14 h-14 rounded-md overflow-hidden cursor-pointer border border-border hover:border-primary transition-colors flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSampleSelect(sampleUrl);
                  }}
                >
                  <NextImage
                    src={sampleUrl}
                    alt={`Sample ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    sizes="56px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
