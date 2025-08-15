"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { isAuthEnabled } from '@/lib/auth';
import { toast } from 'sonner';
import { Drawing } from './shared-types';
import { formatStyle } from './shared-utils';
import { DrawingCard } from './drawing-card';
import { DrawingDetailModal } from './drawing-detail-modal';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { ProgressCircle } from './progress-circle';

interface RecentDrawingsProps {
  isGenerating?: boolean;
  newDrawing?: {
    style: string;
    ratio: string;
  } | null;
  error?: string | null;
  onNewDrawingGenerated?: (drawing: Drawing) => void;
  className?: string;
  isPaidUser?: boolean | null;
}

export function RecentDrawings({ 
  isGenerating = false,
  newDrawing = null,
  error = null,
  onNewDrawingGenerated,
  className,
  isPaidUser = null
}: RecentDrawingsProps) {
  const { data: session } = isAuthEnabled() ? useSession() : { data: null };
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawingToDelete, setDrawingToDelete] = useState<Drawing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastGenerationState, setLastGenerationState] = useState<{isGenerating: boolean, hasNewDrawing: boolean}>({
    isGenerating: false,
    hasNewDrawing: false
  });

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

  // Track generation state changes and handle completion
  useEffect(() => {
    // Detect when generation just completed
    // Previous state: was generating, current state: not generating
    if (lastGenerationState.isGenerating && !isGenerating && !error && !isRefreshing) {
      console.log('Generation completed, refreshing drawings...');
      
      const refreshAfterGeneration = async () => {
        setIsRefreshing(true);
        
        // Wait for the database to be updated (API response means it's already saved)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
          await fetchRecentDrawings();
          console.log('Drawings refreshed successfully');
        } catch (error) {
          console.error('Failed to refresh drawings:', error);
        } finally {
          setIsRefreshing(false);
        }
      };
      
      refreshAfterGeneration();
    }
    
    // Update the last state
    setLastGenerationState({
      isGenerating: isGenerating,
      hasNewDrawing: !!newDrawing
    });
  }, [isGenerating, newDrawing, error, lastGenerationState.isGenerating, isRefreshing]);

  // Handle delete drawing
  const handleDelete = async (drawing: Drawing) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/delete-drawing/${drawing.uuid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete drawing");
      }

      setDrawings(prev => prev.filter(d => d.uuid !== drawing.uuid));
      toast.success("Drawing deleted successfully");
      setIsDeleteDialogOpen(false);
      setDrawingToDelete(null);
    } catch (error) {
      console.error("Error deleting drawing:", error);
      toast.error("Failed to delete drawing");
    } finally {
      setIsDeleting(false);
    }
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
            {/* New drawing being generated, loading, or error state */}
            {(isGenerating && newDrawing) || isRefreshing || error ? (
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
                      {isPaidUser === false ? (
                        // Free user: progress circle + upgrade button
                        <>
                          <ProgressCircle 
                            duration={80} 
                            className="mb-3" 
                            size={48} 
                            strokeWidth={3}
                          />
                          <div className="text-xs text-center px-2">
                            <div className="text-muted-foreground mt-1">About 50-60 seconds</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 h-8 text-xs hidden sm:block"
                              onClick={() => window.open('/pricing', '_blank')}
                            >
                              Upgrade for 2x Speed
                            </Button>
                          </div>
                        </>
                      ) : (
                        // Paid user: traditional loading + progress bar
                        <>
                          <ProgressCircle 
                            duration={40} 
                            className="mb-3" 
                            size={48} 
                            strokeWidth={3}
                          />
                          <div className="text-xs text-center px-2">
                            <div className="text-muted-foreground mt-1">About 20-30 seconds</div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ) : null}
            
            {/* Existing drawings */}
            {drawings.slice(0, (isGenerating && newDrawing) || isRefreshing || error ? 3 : 4).map((drawing) => (
              <DrawingCard
                key={drawing.uuid}
                drawing={drawing}
                onClick={() => setSelectedDrawing(drawing)}
                className="aspect-square p-0"
                showDownloadButton={true}
                showToast={false}
                showDeleteButton={false}
              />
            ))}
            
            {/* Empty slots when less than 4 drawings */}
            {!isGenerating && !isRefreshing && !error && drawings.length < 4 && Array.from({ length: 4 - drawings.length }).map((_, index) => (
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
      <DrawingDetailModal
        drawing={selectedDrawing}
        isOpen={!!selectedDrawing}
        onClose={() => setSelectedDrawing(null)}
        showDeleteButton={true}
        onDelete={(drawing) => {
          setSelectedDrawing(null);
          setDrawingToDelete(drawing);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        drawing={drawingToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

// Export the component with both names for backward compatibility
export { RecentDrawings as ResultDisplay };
