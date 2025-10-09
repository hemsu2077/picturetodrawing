"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { type PopularStylesConfigKey } from '@/config/drawing-styles';
import { getAllDrawingStyles } from '@/config/drawing-styles';
import { STYLE_CATEGORIES } from '@/config/style-categories';
import { Button } from '@/components/ui/button';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  className?: string;
  popularStylesKey?: PopularStylesConfigKey;
}

export function StyleSelector({ selectedStyle, onStyleChange, className, popularStylesKey = 'default' }: StyleSelectorProps) {
  const t = useTranslations('drawing_generator');
  const [activeCategory, setActiveCategory] = useState('all');
  const allStyles = getAllDrawingStyles(t);

  // Filter styles based on active category
  const filteredStyles = useMemo(() => {
    if (activeCategory === 'all') {
      return allStyles;
    }
    
    const category = STYLE_CATEGORIES.find(cat => cat.id === activeCategory);
    if (!category) return allStyles;
    
    return allStyles.filter(style => category.styles.includes(style.id));
  }, [activeCategory, allStyles]);

  // Category tabs configuration
  const categories = [
    { id: 'all', label: t('categories.all') },
    ...STYLE_CATEGORIES.map(cat => ({
      id: cat.id,
      label: t(`categories.${cat.id}`)
    }))
  ];

  return (
    <div className={cn("space-y-3 rounded-lg bg-card", className)}>
      <div className="px-4 pt-4">
        <p className="text-md font-medium text-foreground">{t('drawing_style')}</p>
      </div>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "whitespace-nowrap text-xs px-2 py-1 rounded-md transition-all",
              activeCategory === category.id 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Styles Grid - Fixed height */}
      <div className="h-[400px] overflow-y-auto px-4 pb-4 pt-4 border-y border-border/50">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredStyles.map((style) => (
            <div
              key={style.id}
              className={cn(
                "group cursor-pointer rounded-[10px] overflow-hidden transition-all duration-200",
                "hover:shadow-md",
                selectedStyle === style.id 
                  ? "ring-2 ring-primary shadow-md" 
                  : "hover:ring-2 hover:ring-primary/30"
              )}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="relative">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={style.image}
                    alt={style.name + " - Picture to Drawing style"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="px-1.5 py-1.5 bg-card">
                  <p className={cn(
                    "text-xs font-medium text-center transition-colors line-clamp-2",
                    selectedStyle === style.id 
                      ? "text-primary" 
                      : "text-foreground/80 group-hover:text-foreground"
                  )}>
                    {style.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
