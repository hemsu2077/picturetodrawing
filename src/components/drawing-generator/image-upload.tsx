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
    'https://files.picturetodrawing.com/sample/sample-5.webp',
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
        <div className="relative h-108 lg:h-128 rounded-lg border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
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
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors h-108 lg:h-128 flex flex-col items-center justify-center",
            "hover:border-primary/50 hover:bg-accent/50",
            isDragging && "border-primary bg-accent"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t('daily_checkin.upload_picture')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('daily_checkin.drag_drop_hint')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('daily_checkin.supported_formats')}
              </p>
            </div>
            <Button variant="outline" className="mt-2" onClick={openFileDialog}>
              <Upload className="h-4 w-4 mr-2" />
              {t('daily_checkin.choose_file')}
            </Button>
          </div>
          
          <div className="max-w-sm py-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">{t('daily_checkin.try_samples')}</p>
            <div className="grid grid-cols-4 gap-2 px-4 lg:px-16">
              {sampleImages.map((sampleUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-sm overflow-hidden cursor-pointer"
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
