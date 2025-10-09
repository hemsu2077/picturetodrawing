"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ProgressCircle } from './progress-circle';
import Image from 'next/image';

interface GenerationProgressProps {
  isGenerating: boolean;
  generatedImageUrl?: string | null;
  error?: string | null;
  onClose: () => void;
  className?: string;
  isPaidUser?: boolean | null;
}

export function GenerationProgress({
  isGenerating,
  generatedImageUrl,
  error,
  onClose,
  className,
  isPaidUser = null
}: GenerationProgressProps) {
  const t = useTranslations('drawing_generator');
  
  // Free users: 60s progress bar, Paid users: 30s progress bar
  const progressDuration = isPaidUser === true ? 30 : 60;
  const progressText = isPaidUser === true ? t('about_20_30_seconds') : t('about_50_60_seconds');

  const handleDownload = async () => {
    if (!generatedImageUrl) return;

    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drawing-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      {/* Close and Download buttons - shown when generation is complete */}
      {!isGenerating && !error && generatedImageUrl && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            className="h-9 w-9 rounded-full shadow-lg"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full h-full">
        {error ? (
          // Error state
          <div className="flex flex-col items-center justify-center text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <span className="text-destructive text-2xl">⚠</span>
            </div>
            <div className="text-base font-medium text-destructive mb-2">{t('failed')}</div>
            <div className="text-sm text-muted-foreground break-words whitespace-pre-wrap">{error}</div>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-6"
            >
              {t('try_again') || 'Try Again'}
            </Button>
          </div>
        ) : isGenerating ? (
          // Generating state
          <div className="flex flex-col items-center justify-center gap-6">
            <ProgressCircle 
              duration={progressDuration} 
              size={100} 
              strokeWidth={3}
            />
            <div className="text-sm text-center text-muted-foreground font-medium">
              {progressText}
            </div>
          </div>
        ) : generatedImageUrl ? (
          // Success state - show generated image
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={generatedImageUrl}
              alt="Generated drawing - Picture to Drawing"
              width={800}
              height={800}
              className="rounded-lg object-contain max-w-full max-h-full bg-primary/10"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
