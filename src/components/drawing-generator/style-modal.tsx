"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getAllDrawingStyles, type StyleOption } from '@/config/drawing-styles';

interface StyleModalProps {
  open: boolean;
  onClose: () => void;
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
}

export function StyleModal({ open, onClose, selectedStyle, onStyleSelect }: StyleModalProps) {
  const t = useTranslations('drawing_generator');
  const allStyles = getAllDrawingStyles(t);

  const handleStyleSelect = (styleId: string) => {
    onStyleSelect(styleId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">{t('style_modal.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[70vh] pl-6 py-6 pr-2">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pr-4">
            {allStyles.map((style) => (
              <div
                key={style.id}
                className={cn(
                  "group border cursor-pointer rounded-xl overflow-hidden transition-all duration-200",
                  "hover:shadow-lg",
                  selectedStyle === style.id 
                    ? "ring-2 ring-primary shadow-md" 
                    : "hover:ring-2 hover:ring-primary/30"
                )}
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={style.image}
                      alt={style.name + " - Picture to Drawing style"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {selectedStyle === style.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-3 h-3 text-white"
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
                  <div className="px-2 py-2.5 bg-card">
                    <p className={cn(
                      "text-xs font-medium text-center truncate transition-colors",
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

      </DialogContent>
    </Dialog>
  );
}
