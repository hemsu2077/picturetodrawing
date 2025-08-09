"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Aspect Ratio</h3>
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
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{ratio.label}</span>
                  {ratio.description && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {ratio.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {ASPECT_RATIOS.slice(1).map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => onRatioChange(ratio.value)}
              className={`
                relative border-2 rounded-lg p-2 transition-all text-center
                ${selectedRatio === ratio.value 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div 
                className={`
                  mx-auto bg-muted rounded-sm
                  ${ratio.value === '1:1' ? 'w-8 h-8' : ''}
                  ${ratio.value === '4:3' ? 'w-10 h-8' : ''}
                  ${ratio.value === '3:4' ? 'w-8 h-10' : ''}
                  ${ratio.value === '16:9' ? 'w-12 h-7' : ''}
                  ${ratio.value === '9:16' ? 'w-7 h-12' : ''}
                `}
              />
              <p className="text-xs mt-1 font-medium">{ratio.label}</p>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
