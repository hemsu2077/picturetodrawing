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
  disabled?: boolean;
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

export function RatioSelector({ selectedRatio, onRatioChange, disabled = false, className }: RatioSelectorProps) {

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <p className="text-sm text-muted-foreground mt-1">
        Aspect Ratio
        </p>
      </div>
      
      <Select value={disabled ? 'auto' : selectedRatio} onValueChange={disabled ? undefined : onRatioChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select aspect ratio" />
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
