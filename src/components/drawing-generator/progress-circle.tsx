"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  duration: number; // total duration (seconds)
  className?: string;
}

export function ProgressCircle({ 
  duration, 
  className
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

      if (now < endTime) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
    
    return () => {
      // requestAnimationFrame will stop automatically when component unmounts
    };
  }, []);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Animated pencil icon - simple bounce */}
        <div className="animate-bounce">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M4.33295 16.048L16.5714 3.80952C17.5708 2.81015 19.1911 2.81015 20.1905 3.80952C21.1898 4.8089 21.1898 6.4292 20.1905 7.42857L7.952 19.667C7.6728 19.9462 7.3172 20.1366 6.93002 20.214L3 21L3.786 17.07C3.86344 16.6828 4.05375 16.3272 4.33295 16.048Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.1"
              className="text-foreground"
            />
            <path 
              d="M14.5 6.5L17.5 9.5" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="text-foreground"
            />
          </svg>
        </div>

        {/* Progress percentage */}
        <div className="text-center">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {Math.round(progress)}<span className="text-xl text-muted-foreground"> %</span>
          </div>
        </div>
      </div>
    </div>
  );
}
