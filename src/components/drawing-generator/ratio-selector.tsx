"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface RatioOption {
  value: string;
  label: string;
  description?: string;
}

interface RatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
  disabled?: boolean;
  className?: string;
}

const getAspectRatios = (t: any): RatioOption[] => [
  {
    value: 'auto',
    label: t('ratios.auto'),
    description: t('ratios.auto_description')
  },
  {
    value: '1:1',
    label: '1:1',
    description: t('ratios.square')
  },
  {
    value: '4:3',
    label: '4:3',
    description: t('ratios.landscape')
  },
  {
    value: '3:4',
    label: '3:4',
    description: t('ratios.portrait')
  },
  {
    value: '16:9',
    label: '16:9',
    description: t('ratios.wide')
  },
  {
    value: '9:16',
    label: '9:16',
    description: t('ratios.tall')
  }
];

export function RatioSelector({ selectedRatio, onRatioChange, disabled = false, className }: RatioSelectorProps) {
  const t = useTranslations('drawing_generator');
  const ASPECT_RATIOS = getAspectRatios(t);

  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <p className="text-sm text-muted-foreground">
          {t('aspect_ratio')}
        </p>
      </div>
      
      <Select value={disabled ? 'auto' : selectedRatio} onValueChange={disabled ? undefined : onRatioChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('select_aspect_ratio')} />
        </SelectTrigger>
        <SelectContent>
          {ASPECT_RATIOS.map((ratio) => (
            <SelectItem key={ratio.value} value={ratio.value}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium">{ratio.label}</span>
                  {ratio.description && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {ratio.description}
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
