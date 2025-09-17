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
  const t = useTranslations();
  const allStyles = getAllDrawingStyles(t);

  const handleStyleSelect = (styleId: string) => {
    onStyleSelect(styleId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('drawing_generator.style_modal.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allStyles.map((style) => (
              <div
                key={style.id}
                className={cn(
                  "relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all",
                  "hover:border-primary/50 hover:shadow-md",
                  selectedStyle === style.id 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-border"
                )}
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="aspect-square relative">
                  <img
                    src={style.image}
                    alt={style.name + " - Picture to Drawing style"}
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

      </DialogContent>
    </Dialog>
  );
}
