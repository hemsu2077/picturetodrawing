"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Loader2, Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { isAuthEnabled } from '@/lib/auth';

interface Drawing {
  uuid: string;
  generated_image_url: string;
  original_image_url: string | null;
  style: string;
  ratio: string | null;
  created_at: Date | null;
  filename: string | null;
}

interface RecentDrawingsProps {
  isGenerating?: boolean;
  newDrawing?: {
    style: string;
    ratio: string;
  } | null;
  error?: string | null;
  onNewDrawingGenerated?: (drawing: Drawing) => void;
  className?: string;
}

export function RecentDrawings({ 
  isGenerating = false,
  newDrawing = null,
  error = null,
  onNewDrawingGenerated,
  className 
}: RecentDrawingsProps) {
  const { data: session } = isAuthEnabled() ? useSession() : { data: null };
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch recent drawings
  const fetchRecentDrawings = async () => {
    if (!session?.user?.uuid) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/recent-drawings');
      if (response.ok) {
        const data = await response.json();
        if (data.code === 0) {
          setDrawings(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch recent drawings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.uuid) {
      fetchRecentDrawings();
    }
  }, [session?.user?.uuid]);

  // Handle new drawing generated
  useEffect(() => {
    if (onNewDrawingGenerated && !isGenerating && newDrawing) {
      // Refresh the drawings list when a new drawing is generated
      fetchRecentDrawings();
    }
  }, [isGenerating, newDrawing, onNewDrawingGenerated]);

  const handleDownload = async (drawing: Drawing) => {
    try {
      const response = await fetch(drawing.generated_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = drawing.filename || `drawing-${drawing.style}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatStyle = (style: string) => {
    return style
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Don't show if not authenticated
  if (!session?.user?.uuid) {
    return null;
  }

  // Show loading state if no drawings yet and not generating
  if (loading && drawings.length === 0 && !isGenerating && !error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  // Don't show if no drawings and not generating and no error
  if (drawings.length === 0 && !isGenerating && !error) {
    return null;
  }

  return (
    <>
      <Card className={cn("p-6", className)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Recent Drawings</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your latest artwork creations
              </p>
            </div>
            {drawings.length > 0 && (
              <Link href="/my-drawings">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
          
          {/* Drawings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* New drawing being generated or error state */}
            {(isGenerating && newDrawing) || error ? (
              <Card className="aspect-square p-0 relative overflow-hidden shadow-none border-dashed">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                  {error ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                        <span className="text-destructive text-sm">⚠</span>
                      </div>
                      <div className="text-xs text-center px-2">
                        <div className="font-medium text-destructive">Failed</div>
                        <div className="text-muted-foreground mt-1 break-words whitespace-pre-wrap">{error}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                      <div className="text-xs text-center px-2">
                        <div className="font-medium">{newDrawing && formatStyle(newDrawing.style)}</div>
                        <div className="text-muted-foreground mt-1">Generating...</div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ) : null}
            
            {/* Existing drawings */}
            {drawings.slice(0, (isGenerating && newDrawing) || error ? 3 : 4).map((drawing) => (
              <Card 
                key={drawing.uuid} 
                className="group aspect-square p-0 relative overflow-hidden shadow-none cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedDrawing(drawing)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={drawing.generated_image_url}
                    alt={`Drawing in ${drawing.style} style`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Style badge - shown on hover */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800">
                      {formatStyle(drawing.style)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Empty slots when less than 4 drawings */}
            {!isGenerating && !error && drawings.length < 4 && Array.from({ length: 4 - drawings.length }).map((_, index) => (
              <Card key={`empty-${index}`} className="aspect-square p-0 relative overflow-hidden shadow-none border-dashed">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <Eye className="h-8 w-8 text-gray-300" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Drawing Detail Modal */}
      <Dialog open={!!selectedDrawing} onOpenChange={() => setSelectedDrawing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedDrawing && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative aspect-square bg-gray-100 rounded-lg md:col-span-2">
                <Image
                  src={selectedDrawing.generated_image_url}
                  alt={`Drawing in ${selectedDrawing.style} style`}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Drawing Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Style</label>
                    <p className="text-gray-900">{formatStyle(selectedDrawing.style)}</p>
                  </div>
                  
                  {selectedDrawing.ratio && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Aspect Ratio</label>
                      <p className="text-gray-900">{selectedDrawing.ratio}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">{formatDate(selectedDrawing.created_at)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleDownload(selectedDrawing)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export the component with both names for backward compatibility
export { RecentDrawings as ResultDisplay };
