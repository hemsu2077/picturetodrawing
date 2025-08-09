"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: { file: File; preview: string } | null;
  className?: string;
}

export function ImageUpload({ onImageSelect, selectedImage, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];

  const handleFileSelect = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, WEBP, HEIC)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onImageSelect(null as any, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.heic"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage.preview}
            alt="Selected image"
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            "hover:border-primary/50 hover:bg-accent/50",
            isDragging && "border-primary bg-accent"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload an image</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP, HEIC formats
              </p>
            </div>
            <Button variant="outline" className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
