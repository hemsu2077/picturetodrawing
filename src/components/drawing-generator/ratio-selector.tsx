"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface RatioOption {
  value: string;
  label: string;
  description?: string;
}

interface RatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
  className?: string;
}

const ASPECT_RATIOS: RatioOption[] = [
  {
    value: 'auto',
    label: 'Auto',
    description: 'Match input image'
  },
  {
    value: '1:1',
    label: '1:1',
    description: 'Square'
  },
  {
    value: '4:3',
    label: '4:3',
    description: 'Landscape'
  },
  {
    value: '3:4',
    label: '3:4',
    description: 'Portrait'
  },
  {
    value: '16:9',
    label: '16:9',
    description: 'Wide'
  },
  {
    value: '9:16',
    label: '9:16',
    description: 'Tall'
  }
];

export function RatioSelector({ selectedRatio, onRatioChange, className }: RatioSelectorProps) {
  const getRatioIcon = (ratio: string) => {
    const iconClasses = "bg-muted border border-border/50 p-1";
    switch (ratio) {
      case '1:1': return <div className={`w-4 h-4 ${iconClasses}`} />;
      case '4:3': return <div className={`w-5 h-4 ${iconClasses}`} />;
      case '3:4': return <div className={`w-4 h-5 ${iconClasses}`} />;
      case '16:9': return <div className={`w-6 h-3 ${iconClasses}`} />;
      case '9:16': return <div className={`w-3 h-6 ${iconClasses}`} />;
      default: return <div className={`w-4 h-4 ${iconClasses} bg-primary/20`} />;
    }
  };
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the output image dimensions
        </p>
      </div>
      
      <Select value={selectedRatio} onValueChange={onRatioChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select aspect ratio" />
        </SelectTrigger>
        <SelectContent>
          {ASPECT_RATIOS.map((ratio) => (
            <SelectItem key={ratio.value} value={ratio.value}>
              <div className="flex items-center gap-3">
                {getRatioIcon(ratio.value)}
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
