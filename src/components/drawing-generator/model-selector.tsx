"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ModelOption {
  value: string;
  label: string;
  description?: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

const AI_MODELS: ModelOption[] = [
  {
    value: 'default',
    label: 'Classic',
    description: 'Natural drawing'
  },
  {
    value: 'nano-banana',
    label: 'Nano Banana 🍌',
    description: 'Creative style'
  }
];

export function ModelSelector({ selectedModel, onModelChange, className }: ModelSelectorProps) {

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <p className="text-sm text-muted-foreground">
          AI model
        </p>
      </div>
      
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium">{model.label}</span>
                  {model.description && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {model.description}
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
