"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { getAllDrawingStyles } from '@/config/drawing-styles';

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
    <div className={cn("", className)}>
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        <img
          src={displayStyle.preview}
          alt={displayStyle.name + ' - Picture to Drawing Style Preview'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-md">
          <p className="text-white text-xs font-medium whitespace-nowrap">
            {displayStyle.name}
          </p>
        </div>
      </div>
    </div>
  );
}
