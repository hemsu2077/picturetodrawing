"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ImageUploadProps {
  onImageSelect: (file: File | string, preview: string) => void;
  selectedImage?: { file: File | string; preview: string } | null;
  className?: string;
}

export function ImageUpload({ onImageSelect, selectedImage, className }: ImageUploadProps) {
  const t = useTranslations();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];

  // Sample images URLs
  const sampleImages = [
    'https://files.picturetodrawing.com/sample/sample-1.webp',
    'https://files.picturetodrawing.com/sample/sample-2.webp',
    'https://files.picturetodrawing.com/sample/sample-3.webp',
    'https://files.picturetodrawing.com/sample/sample-4.webp',
  ];

  const handleFileSelect = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      alert(t('daily_checkin.invalid_file'));
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

  const handleSampleImageSelect = (sampleUrl: string) => {
    onImageSelect(sampleUrl, sampleUrl);
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
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.heic"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {selectedImage ? (
        <div className="relative w-full rounded-lg border-2 border-border overflow-hidden bg-white flex items-center justify-center aspect-square lg:aspect-[3/2]">
          <img
            src={selectedImage.preview}
            alt={t('drawing_generator.selected_image_alt')}
            className="max-w-full max-h-full object-contain"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 border shadow-sm"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-3 text-center transition-colors w-full flex flex-col justify-center cursor-pointer aspect-square lg:aspect-[3/2]",
            "hover:border-primary/50 hover:bg-accent/20",
            isDragging && "border-primary bg-accent/20"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="p-3 rounded-full bg-primary/5">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-md font-medium">{t('daily_checkin.upload_picture')}</h3>
              <p className="text-xs text-muted-foreground leading-tight">
                {t('daily_checkin.drag_drop_hint')}
              </p>
            </div>
          </div>
          
          <div className="w-full pt-4 border-t mt-3">
            <p className="text-xs text-muted-foreground mb-2">{t('daily_checkin.try_samples')}</p>
            <div className="flex items-center justify-center gap-1">
              {sampleImages.map((sampleUrl, index) => (
                <div
                  key={index}
                  className="relative w-12 h-12 rounded-sm overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-colors flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSampleImageSelect(sampleUrl);
                  }}
                >
                  <img
                    src={sampleUrl}
                    alt={t('drawing_generator.sample_alt', { index: index + 1 })}
                    className="w-full h-full hover:scale-105 transition-transform object-cover"
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
