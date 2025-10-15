"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
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
      
      onFileSelect(file);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Failed to load sample image:', error);
      alert('Failed to load sample image. Please try again.');
    }
  };

  const handleClear = () => {
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="relative w-full flex-1 rounded-lg overflow-hidden border bg-muted/30">
          {previewUrl && (
            <Image
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
                  <Image
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
