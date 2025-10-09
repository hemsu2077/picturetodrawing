"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { getAllDrawingStyles } from '@/config/drawing-styles';
import { Palette } from 'lucide-react';

interface StylePreviewProps {
  selectedStyle: string;
  className?: string;
}

export function StylePreview({ selectedStyle, className }: StylePreviewProps) {
  const t = useTranslations('drawing_generator');
  const allStyles = getAllDrawingStyles(t);
  
  const currentStyle = allStyles.find(style => style.id === selectedStyle);
  const defaultStyle = allStyles[0];
  const displayStyle = currentStyle || defaultStyle;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">{t('style_preview_title')}</h3>
      </div>
      
      <div className="relative rounded-lg overflow-hidden border-2 border-border bg-muted aspect-square">
        <img
          src={displayStyle.image}
          alt={displayStyle.name + ' - Picture to Drawing Style Preview'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
          <div className="text-white font-semibold text-xl">{displayStyle.name}</div>
          {displayStyle.description && (
            <p className="text-white/90 text-sm mt-1">{displayStyle.description}</p>
          )}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        {t('style_preview_hint')}
      </div>
    </div>
  );
}
