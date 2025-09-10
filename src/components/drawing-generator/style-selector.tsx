"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface StyleOption {
  id: string;
  name: string;
  image: string;
}

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  className?: string;
}

const getDrawingStyles = (t: any): StyleOption[] => [
  {
    id: 'pencil-sketch',
    name: t('drawing_generator.styles.pencil_sketch'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pencil-sketch.webp'
  },
  {
    id: 'line-drawing',
    name: t('drawing_generator.styles.line_drawing'), 
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-drawing.webp'
  },
  {
    id: 'charcoal-drawing',
    name: t('drawing_generator.styles.charcoal_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/charcoal-drawing.webp'
  },
  {
    id: 'color-pencil-drawing',
    name: t('drawing_generator.styles.color_pencil_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/color-pencil-drawing.webp'
  },
  {
    id: 'watercolor-painting',
    name: t('drawing_generator.styles.watercolor_painting'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/watercolor-painting.webp'
  },
  {
    id: 'inkart',
    name: t('drawing_generator.styles.inkart'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/inkart.webp'
  },
  {
    id: 'superhero-comic',
    name: t('drawing_generator.styles.superhero_comic'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/superhero-comic.webp'
  },
  {
    id: 'manga',
    name: t('drawing_generator.styles.manga'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/manga.webp'
  }
];

export function StyleSelector({ selectedStyle, onStyleChange, className }: StyleSelectorProps) {
  const t = useTranslations();
  const DRAWING_STYLES = getDrawingStyles(t);
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">{t('drawing_generator.drawing_style')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DRAWING_STYLES.map((style) => (
            <div
              key={style.id}
              className={cn(
                "relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all",
                "hover:border-primary/50 hover:shadow-md",
                selectedStyle === style.id 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border"
              )}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="aspect-square relative">
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end">
                  <div className="w-full p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium text-center">
                      {style.name}
                    </p>
                  </div>
                </div>
              </div>
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
}
