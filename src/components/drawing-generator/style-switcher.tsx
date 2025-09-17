"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChevronDown, Palette } from 'lucide-react';
import { getAllDrawingStyles } from '@/config/drawing-styles';

interface StyleSwitcherProps {
  selectedStyle: string;
  onClick: () => void;
  className?: string;
}

export function StyleSwitcher({ selectedStyle, onClick, className }: StyleSwitcherProps) {
  const t = useTranslations();
  const allStyles = getAllDrawingStyles(t);
  
  const currentStyle = allStyles.find(style => style.id === selectedStyle);
  const defaultStyle = allStyles[0]; // fallback to first style
  const displayStyle = currentStyle || defaultStyle;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full h-auto p-0 justify-between hover:bg-accent/20 hover:border-primary/20 overflow-hidden"
    >
      <div className="flex items-center w-full">
        <div className="w-28 h-28 flex-shrink-0 bg-muted">
          <img
            src={displayStyle.image}
            alt={displayStyle.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start px-4 flex-1">
          <span className="font-semibold text-base">{displayStyle.name}</span>
          <span className="text-sm text-muted-foreground">
            {t('drawing_generator.style_modal.select_style')}
          </span>
        </div>
        <div className="px-4">
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </Button>
  );
}
