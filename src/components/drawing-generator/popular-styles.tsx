"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { getPopularStyles, type PopularStylesConfigKey } from '@/config/drawing-styles';

interface PopularStylesProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  className?: string;
  configKey?: PopularStylesConfigKey;
}

export function PopularStyles({ selectedStyle, onStyleChange, className, configKey = 'default' }: PopularStylesProps) {
  const t = useTranslations('drawing_generator');
  const popularStyles = getPopularStyles(t, configKey);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">
          {t('style_modal.popular_styles')}
        </p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {popularStyles.map((style) => (
          <div
            key={style.id}
            className={cn(
              "relative cursor-pointer rounded-md border overflow-hidden transition-all",
              "hover:border-primary/50 hover:shadow-sm",
              "border-border" // No selection state for popular styles
            )}
            onClick={() => onStyleChange(style.id)}
          >
            <div className="aspect-square relative">
              <img
                src={style.image}
                alt={style.name + " - Picture to Drawing Styles"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0">
                <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-2 pb-2">
                  <p className="text-white text-xs font-medium text-center truncate">
                    {style.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
