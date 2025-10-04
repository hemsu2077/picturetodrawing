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
import { useTranslations } from 'next-intl';
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
  trialResult?: any; // For trial users' generated result
}

export function RecentDrawings({ 
  isGenerating = false,
  newDrawing = null,
  error = null,
  onNewDrawingGenerated,
  className,
  isPaidUser = null,
  trialResult = null
}: RecentDrawingsProps) {
  const { data: session } = isAuthEnabled() ? useSession() : { data: null };
  const t = useTranslations();
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
  const [showProgressCard, setShowProgressCard] = useState(false);

  // Fetch recent drawings (only for logged-in users)
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
    // Show progress card when generation starts
    if (isGenerating && newDrawing && !showProgressCard) {
      setShowProgressCard(true);
    }
    
    // Detect when generation just completed
    // Previous state: was generating, current state: not generating
    if (lastGenerationState.isGenerating && !isGenerating && !error && !isRefreshing) {
      console.log('Generation completed, refreshing drawings...');
      
      const refreshAfterGeneration = async () => {
        setIsRefreshing(true);
        
        // Wait for the database to be updated (API response means it's already saved)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
          // Only fetch if user is logged in
          if (session?.user?.uuid) {
            await fetchRecentDrawings();
            console.log('Drawings refreshed successfully');
          }
        } catch (error) {
          console.error('Failed to refresh drawings:', error);
        } finally {
          setIsRefreshing(false);
          setShowProgressCard(false); //
        }
      };
      
      refreshAfterGeneration();
    }
    
    // Reset progress card on error
    if (error) {
      setShowProgressCard(false);
    }
    
    // Update the last state
    setLastGenerationState({
      isGenerating: isGenerating,
      hasNewDrawing: !!newDrawing
    });
  }, [isGenerating, newDrawing, error, lastGenerationState.isGenerating, isRefreshing, showProgressCard, session?.user?.uuid]);

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
      toast.success(t("my_drawings.delete_success"));
      setIsDeleteDialogOpen(false);
      setDrawingToDelete(null);
    } catch (error) {
      console.error("Error deleting drawing:", error);
      toast.error(t("my_drawings.delete_failed"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Show for both logged-in users and trial users with results
  const canManageDrawings = Boolean(session?.user?.uuid);
  const shouldShow = session?.user?.uuid || trialResult || isGenerating || error;
  
  if (!shouldShow) {
    return null;
  }

  // Show loading state if no drawings yet and not generating (logged-in users only)
  // if (session?.user?.uuid && loading && drawings.length === 0 && !isGenerating && !error) {
  //   return (
  //     <Card className={cn("p-6 shadow-none border-primary/60", className)}>
  //       <div className="flex items-center justify-center py-8">
  //         <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  //       </div>
  //     </Card>
  //   );
  // }

  // Don't show if no drawings and not generating and no error and no trial result
  if (drawings.length === 0 && !isGenerating && !error && !trialResult) {
    return null;
  }

  // Create trial result drawing object for display (only for non-logged-in users)
  const trialDrawing = trialResult && !session?.user?.uuid ? {
    uuid: 'trial-result',
    generated_image_url: trialResult[0]?.url || '',
    style: newDrawing?.style || 'pencil-sketch',
    model: trialResult[0]?.model || 'default',
    ratio: newDrawing?.ratio || 'auto',
    created_at: new Date(),
    user_uuid: '',
    original_image_url: '',
    provider: trialResult[0]?.provider || 'replicate',
    filename: trialResult[0]?.filename || '',
    status: 'completed'
  } : null;

  return (
    <>
      <Card className={cn("p-6 ", className)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">
                {session?.user?.uuid ? t('drawing_generator.recent_drawings') : t('drawing_generator.your_drawing')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {session?.user?.uuid ? t('drawing_generator.latest_artwork') : t('drawing_generator.generated_result')}
              </p>
            </div>
            {session?.user?.uuid && drawings.length > 0 && (
              <Link href="/my-drawings">
                <Button variant="outline" size="sm">
                  {t('drawing_generator.view_all')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
          
          {/* Drawings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* New drawing being generated, loading, or error state */}
            {showProgressCard || error ? (
              <Card className="aspect-square p-0 relative overflow-hidden shadow-none border-dashed">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                  {error ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                        <span className="text-destructive text-sm">⚠</span>
                      </div>
                      <div className="text-xs text-center px-2">
                        <div className="font-medium text-destructive">{t('drawing_generator.failed')}</div>
                        <div className="text-muted-foreground mt-1 break-words whitespace-pre-wrap">{error}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* All users use the same progress bar */}
                      {/* {isPaidUser === true ? (
                        // Paid user: fast loading
                        <>
                          <ProgressCircle 
                            duration={40} 
                            className="mb-3" 
                            size={48} 
                            strokeWidth={3}
                          />
                          <div className="text-xs text-center px-2">
                            <div className="text-muted-foreground mt-1">{t('drawing_generator.about_20_30_seconds')}</div>
                          </div>
                        </>
                      ) : (
                        // Non-paid user (logged-in free or trial): slow loading + upgrade button
                        <>
                          <ProgressCircle 
                            duration={80} 
                            className="mb-3" 
                            size={48} 
                            strokeWidth={3}
                          />
                          <div className="text-xs text-center px-2">
                            <div className="text-muted-foreground mt-1">{t('drawing_generator.about_50_60_seconds')}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 h-8 text-xs hidden sm:block"
                              onClick={() => window.open('/pricing', '_blank')}
                            >
                              {t('drawing_generator.upgrade_for_speed')}
                            </Button>
                          </div>
                        </>
                      )} */}
                      
                      {/* all users use the same progress bar */}
                      <ProgressCircle 
                        duration={40} 
                        className="mb-3" 
                        size={48} 
                        strokeWidth={3}
                      />
                      <div className="text-xs text-center px-2">
                        <div className="text-muted-foreground mt-1">{t('drawing_generator.about_20_30_seconds')}</div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ) : null}
            
            {/* Trial result for non-logged-in users */}
            {trialDrawing && (
              <DrawingCard
                key={trialDrawing.uuid}
                drawing={trialDrawing}
                onClick={() => setSelectedDrawing(trialDrawing)}
                className="aspect-square p-0"
                showDownloadButton={true}
                showToast={false}
                showDeleteButton={false}
              />
            )}
            
            {/* Existing drawings (logged-in users only) */}
            {session?.user?.uuid && drawings.slice(0, (showProgressCard || error) ? 3 : (trialDrawing ? 3 : 4)).map((drawing) => (
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
            {!showProgressCard && !error && !trialDrawing && session?.user?.uuid && drawings.length < 4 && Array.from({ length: 4 - drawings.length }).map((_, index) => (
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
        showDeleteButton={canManageDrawings}
        onDelete={canManageDrawings ? (drawing) => {
          setSelectedDrawing(null);
          setDrawingToDelete(drawing);
          setIsDeleteDialogOpen(true);
        } : undefined}
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
