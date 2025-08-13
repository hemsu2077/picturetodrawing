"use client";

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Download, Trash2 } from 'lucide-react';
import { Drawing } from './shared-types';
import { formatStyle, handleDownload } from './shared-utils';
import { cn } from '@/lib/utils';

interface DrawingCardProps {
  drawing: Drawing;
  onClick?: () => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  showDownloadButton?: boolean;
  showToast?: boolean;
  className?: string;
}

export function DrawingCard({ 
  drawing, 
  onClick, 
  showDeleteButton = false, 
  onDelete,
  showDownloadButton = true,
  showToast = false,
  className 
}: DrawingCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden shadow-none py-0 cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-square relative">
        <Image
          src={drawing.generated_image_url}
          alt={`Drawing in ${drawing.style} style`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
        
        {/* Style badge - shown on hover */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800">
            {formatStyle(drawing.style)}
          </div>
        </div>

        {/* Action buttons container */}
        <div className="absolute top-2 right-2 flex gap-1">
          {/* Download button - shown on hover if enabled */}
          {showDownloadButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(drawing, showToast);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/60 hover:bg-primary text-white p-1.5 rounded-full"
              title="Download"
            >
              <Download className="w-3 h-3" />
            </button>
          )}
          
          {/* Delete button - shown on hover if enabled */}
          {showDeleteButton && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
