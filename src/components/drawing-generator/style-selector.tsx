"use client";

import React from 'react';
import { cn } from '@/lib/utils';

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

const DRAWING_STYLES: StyleOption[] = [
  {
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pencil-sketch.webp'
  },
  {
    id: 'line-drawing',
    name: 'Line Drawing', 
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-drawing.webp'
  },
  {
    id: 'charcoal-drawing',
    name: 'Charcoal Drawing',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/charcoal-drawing.webp'
  },
  {
    id: 'color-pencil-drawing',
    name: 'Color Pencil Drawing',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/color-pencil-drawing.webp'
  },
  {
    id: 'watercolor-painting',
    name: 'Watercolor Painting',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/watercolor-painting.webp'
  },
  {
    id: 'inkart',
    name: 'InkArt',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/inkart.webp'
  },
  {
    id: 'superhero-comic',
    name: 'Superhero Comic',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/superhero-comic.webp'
  },
  {
    id: 'manga',
    name: 'Manga',
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/manga.webp'
  }
];

export function StyleSelector({ selectedStyle, onStyleChange, className }: StyleSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">Drawing Style</h3>
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
