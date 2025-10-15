"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImagePreviewProps {
  imageUrl: string | null;
  isResult?: boolean;
  onDownload?: () => void;
  onClose?: () => void;
  className?: string;
}

const DEFAULT_SAMPLE = "https://files.picturetodrawing.com/styles/pencil-sketch.webp?v=1.1";

export function ImagePreview({
  imageUrl,
  isResult = false,
  onDownload,
  onClose,
  className,
}: ImagePreviewProps) {
  const displayUrl = imageUrl || DEFAULT_SAMPLE;

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden", className)}>
      {/* Action buttons for result */}
      {isResult && imageUrl && onDownload && onClose && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
            className="h-9 w-9 rounded-full shadow-lg bg-background/90 hover:bg-background hover:scale-110 transition-all"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full shadow-lg bg-background/90 hover:bg-background hover:scale-110 transition-all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Image
        src={displayUrl}
        alt={isResult ? "Line art result" : "Preview"}
        width={800}
        height={800}
        className="max-w-full max-h-full object-contain"
        unoptimized
      />
    </div>
  );
}
