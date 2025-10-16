"use client";

import { Button } from "@/components/ui/button";
import { Download, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ImagePreviewProps {
  imageUrl: string | null;
  isResult?: boolean;
  onDownload?: () => void;
  onClose?: () => void;
  className?: string;
  upgradeHint?: string;
  upgradeButtonText?: string;
}

const DEFAULT_SAMPLE = "https://files.picturetodrawing.com/free-tools/photo-to-sketch/photo-to-sketch-sample-hero.webp";

export function ImagePreview({
  imageUrl,
  isResult = false,
  onDownload,
  onClose,
  className,
  upgradeHint,
  upgradeButtonText,
}: ImagePreviewProps) {
  const t = useTranslations('free_line_art');
  const displayUrl = imageUrl || DEFAULT_SAMPLE;

  return (
    <div className={cn("relative w-full h-full flex flex-col", className)}>
      {/* Image preview area */}
      <div className="relative flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
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
          alt={isResult ? t('photo_to_sketch_result') : t('preview')}
          width={800}
          height={800}
          className="max-w-full max-h-full object-contain"
          unoptimized
        />
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
