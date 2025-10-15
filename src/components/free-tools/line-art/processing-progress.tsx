"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProcessingProgressProps {
  className?: string;
  upgradeHint?: string;
  upgradeButtonText?: string;
}

export function ProcessingProgress({ className, upgradeHint, upgradeButtonText }: ProcessingProgressProps) {
  return (
    <div className={cn("relative w-full h-full flex flex-col", className)}>
      {/* Processing area */}
      <div className="relative flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
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

      {/* Upgrade hint section - lightweight guidance */}
      {upgradeHint && upgradeButtonText && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80">
          <Sparkles className="h-3 w-3 flex-shrink-0 text-primary/60" />
          <span className="leading-tight">{upgradeHint}</span>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-primary hover:text-primary/80 leading-tight"
            >
              {upgradeButtonText}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
