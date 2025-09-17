"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

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

const getAiModels = (t: any): ModelOption[] => [
  {
    value: 'default',
    label: t('drawing_generator.models.classic'),
    description: t('drawing_generator.models.classic_description')
  },
  {
    value: 'nano-banana',
    label: t('drawing_generator.models.nano_banana'),
    description: t('drawing_generator.models.nano_banana_description')
  }
];

export function ModelSelector({ selectedModel, onModelChange, className }: ModelSelectorProps) {
  const t = useTranslations();
  const AI_MODELS = getAiModels(t);

  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <p className="text-sm text-muted-foreground">
          {t('drawing_generator.ai_model')}
        </p>
      </div>
      
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('drawing_generator.select_ai_model')} />
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
