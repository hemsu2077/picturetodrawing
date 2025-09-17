"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { StyleModal } from './style-modal';
import { StyleSwitcher } from './style-switcher';
import { PopularStyles } from './popular-styles';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  className?: string;
}

export function StyleSelector({ selectedStyle, onStyleChange, className }: StyleSelectorProps) {
  const t = useTranslations();
  const [showStyleModal, setShowStyleModal] = useState(false);

  const handleStyleModalOpen = () => {
    setShowStyleModal(true);
  };

  const handleStyleModalClose = () => {
    setShowStyleModal(false);
  };

  const handleStyleSelect = (styleId: string) => {
    onStyleChange(styleId);
  };

  return (
    <div className={cn("space-y-4", className)}>
       <p className="text-lg font-medium text-foreground">{t('drawing_generator.drawing_style')}</p>
      
      {/* Drawing Style and Popular Styles - Grouped together */}
      <div className="space-y-2">
        <StyleSwitcher
          selectedStyle={selectedStyle}
          onClick={handleStyleModalOpen}
        />
        
        <PopularStyles
          selectedStyle={selectedStyle}
          onStyleChange={handleStyleSelect}
        />
      </div>

      {/* Style Selection Modal */}
      <StyleModal
        open={showStyleModal}
        onClose={handleStyleModalClose}
        selectedStyle={selectedStyle}
        onStyleSelect={handleStyleSelect}
      />
    </div>
  );
}
