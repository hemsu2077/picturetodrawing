"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProcessingProgressProps {
  className?: string;
}

export function ProcessingProgress({ className }: ProcessingProgressProps) {
  return (
    <div className={cn(
      "relative w-full h-full flex flex-col items-center justify-center bg-muted/30 rounded-lg overflow-hidden",
      className
    )}>
      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>
        
        <div className="text-sm text-center text-muted-foreground px-4">
          Processing your image...
        </div>
      </div>
    </div>
  );
}
