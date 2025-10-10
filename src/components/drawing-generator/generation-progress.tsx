"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ProgressCircle } from './progress-circle';
import { AnimatedGradientBackground } from './animated-gradient-background';
import Image from 'next/image';
import { useAppContext } from '@/contexts/app';

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
  const { setShowPricingModal } = useAppContext();
  const [currentProgress, setCurrentProgress] = React.useState(0);
  
  // Free users: 60s progress bar, Paid users: 30s progress bar
  const progressDuration = isPaidUser === true ? 30 : 60;
  
  // Dynamic progress text based on percentage (using non-round numbers to feel more natural)
  const getProgressText = (progress: number): string => {
    if (progress < 28) {
      return t('progress_analyzing'); // 🧠 Analyzing your image...
    } else if (progress < 73) {
      return t('progress_creating'); // 🎨 Creating the base composition...
    } else if (progress < 94) {
      return t('progress_enhancing'); // ✨ Enhancing details...
    } else {
      return t('progress_almost_ready'); // 💫 Almost ready!
    }
  };
  
  const progressText = getProgressText(currentProgress);
  
  const handleProgressChange = React.useCallback((progress: number) => {
    setCurrentProgress(progress);
  }, []);

  const handleUpgrade = () => {
    setShowPricingModal(true);
  };

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
    <div className={cn("relative w-full h-full flex items-center justify-center rounded-lg", className)}>
      {/* Close and Download buttons - shown when generation is complete */}
      {!isGenerating && !error && generatedImageUrl && (
        <div className="absolute top-4 right-4 z-10 flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="h-9 w-9 rounded-full shadow-lg cursor-pointer hover:bg-background hover:scale-110 transition-all"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full shadow-lg cursor-pointer hover:bg-background hover:scale-110 transition-all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full h-full">
        {error ? (
          // Error state with gradient background
          <div className="relative flex flex-col items-center justify-center rounded-lg w-full h-full overflow-hidden">
            <AnimatedGradientBackground gradientId="errorGradient" />

            {/* Content layer */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md px-4">
              {/* Illustration */}
              <div className="mb-6">
                <Image
                  src="https://files.picturetodrawing.com/ui/loading-drawing.webp"
                  alt="Loading illustration"
                  width={800}
                  height={800}
                  className="w-auto h-auto opacity-60"
                  unoptimized
                />
              </div>
              
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
          </div>
        ) : isGenerating ? (
          // Generating state with elegant gradient background
          <div className="relative flex flex-col items-center justify-center rounded-lg w-full h-full overflow-hidden">
            <AnimatedGradientBackground gradientId="generatingGradient" />

            {/* Content layer */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-6">
              {/* Illustration */}
              <div className="mb-2">
                <Image
                  src="https://files.picturetodrawing.com/ui/loading-drawing.webp"
                  alt="Loading illustration"
                  width={800}
                  height={800}
                  className="w-auto h-auto opacity-60"
                  unoptimized
                />
              </div>
              
              <ProgressCircle 
                duration={progressDuration}
                onProgressChange={handleProgressChange}
              />
              <div className="text-sm text-center text-muted-foreground px-4">
                {progressText}
              </div>
              
              {/* Speed indicator */}
              {isPaidUser === true ? (
                // 2x speed badge for paid users - Clean white badge with green text
                <div className="relative flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-white/95 dark:border-green-300/30">
                  <Zap className="h-2.5 w-2.5 text-green-600 dark:text-green-500" fill="currentColor" />
                  <span className="text-[10px] font-semibold text-primary tracking-tight">2×</span>
                </div>
              ) : (
                // Upgrade button for free users
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpgrade}
                  className="gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  {t('upgrade_for_speed')}
                </Button>
              )}
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
              className="rounded-lg object-contain max-w-full max-h-full bg-muted/50"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
