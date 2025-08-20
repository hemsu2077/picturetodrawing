"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  duration: number; // total duration (seconds)
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function ProgressCircle({ 
  duration, 
  className, 
  size = 60, 
  strokeWidth = 4 
}: ProgressCircleProps) {
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(() => Date.now()); // 固定开始时间，避免重新计算
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

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
    
    // 清理函数，防止内存泄漏
    return () => {
      // requestAnimationFrame会在组件卸载时自动停止
    };
  }, []); // 移除duration依赖，避免重新开始

  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
