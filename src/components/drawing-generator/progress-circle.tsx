"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  duration: number; // total duration (seconds)
  className?: string;
  onProgressChange?: (progress: number) => void; // callback to notify parent of progress changes
}

export function ProgressCircle({ 
  duration, 
  className,
  onProgressChange
}: ProgressCircleProps) {
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    const endTime = startTime + duration * 1000;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min((elapsed / (duration * 1000)) * 100, 100);
      
      setProgress(newProgress);
      onProgressChange?.(newProgress);

      if (now < endTime) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
    
    return () => {
      // requestAnimationFrame will stop automatically when component unmounts
    };
  }, [onProgressChange]);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="flex flex-col items-center justify-center gap-4">

        {/* Progress percentage */}
        <div className="text-center">
          <div className="text-5xl font-bold tracking-tight text-foreground">
            {Math.round(progress)}<span className="text-xl text-muted-foreground"> %</span>
          </div>
        </div>
      </div>
    </div>
  );
}
