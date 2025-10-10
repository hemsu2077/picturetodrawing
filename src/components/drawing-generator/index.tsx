"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './image-upload';
import { StyleSelector } from './style-selector';
import { StylePreview } from './style-preview';
import { RatioSelector } from './ratio-selector';
import { GenerationProgress } from './generation-progress';
import PricingModal from '@/components/pricing-modal';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/contexts/app';
import { isAuthEnabled } from '@/lib/auth';
import { useLocale, useTranslations } from 'next-intl';
import { Pricing } from '@/types/blocks/pricing';
import { RiCoinsLine } from 'react-icons/ri';
import { type PopularStylesConfigKey } from '@/config/drawing-styles';
import { getModelForStyle } from '@/config/drawing-prompts';
import { useSearchParams } from 'next/navigation';

interface DrawingGeneratorProps {
  className?: string;
  defaultStyle?: string;
  popularStylesKey?: PopularStylesConfigKey;
}

interface TrialStatus {
  canUseTrial: boolean;
  isTrialUsage: boolean;
  isLoggedIn: boolean;
}

export function DrawingGenerator({
  className,
  defaultStyle = 'pencil-sketch',
  popularStylesKey = 'default'
}: DrawingGeneratorProps) {
  const { data: session } = isAuthEnabled() ? useSession() : { data: null };
  const { setShowSignModal, showPricingModal, setShowPricingModal } = useAppContext();
  const locale = useLocale();
  const t = useTranslations('drawing_generator');
  const searchParams = useSearchParams();
  
  // Get style from URL parameter, fallback to defaultStyle
  const urlStyle = searchParams.get('style');
  const initialStyle = urlStyle || defaultStyle;
  
  const [selectedImage, setSelectedImage] = useState<{ file: File | string; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [selectedRatio, setSelectedRatio] = useState('auto');

  // Update style when URL parameter changes
  useEffect(() => {
    if (urlStyle && urlStyle !== selectedStyle) {
      setSelectedStyle(urlStyle);
    }
  }, [urlStyle]);

  // Preserve selected ratio across styles; nano-banana now supports ratios
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDrawing, setNewDrawing] = useState<{ style: string; ratio: string } | null>(null);
  const [pricingData, setPricingData] = useState<Pricing | null>(null);
  const [isPaidUser, setIsPaidUser] = useState<boolean | null>(null);
  const [isCheckingPaidStatus, setIsCheckingPaidStatus] = useState(false);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [isCheckingTrialStatus, setIsCheckingTrialStatus] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showGenerationView, setShowGenerationView] = useState(false);

  // Load pricing data
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        // Load pricing data from the same source as pricing page
        const pricingModule = await import(`@/i18n/pages/pricing/${locale}.json`);
        setPricingData(pricingModule.pricing as Pricing);
      } catch (error) {
        console.error('Failed to load pricing data:', error);
        // Fallback to English if current locale fails
        try {
          const pricingModule = await import('@/i18n/pages/pricing/en.json');
          setPricingData(pricingModule.pricing as Pricing);
        } catch (fallbackError) {
          console.error('Failed to load fallback pricing data:', fallbackError);
        }
      }
    };

    loadPricingData();
  }, [locale]);

  // Check paid status when user session changes
  useEffect(() => {
    const checkPaidStatus = async () => {
      if (!session?.user?.uuid) {
        setIsPaidUser(false);
        return;
      }

      setIsCheckingPaidStatus(true);
      try {
        const response = await fetch('/api/check-paid-status');
        if (response.ok) {
          const data = await response.json();
          console.log('[DrawingGenerator] check-paid-status response:', data);
          if (data.code === 0) {
            setIsPaidUser(data.data.isPaid);
            console.log('[DrawingGenerator] isPaidUser set to:', data.data.isPaid);
          } else {
            setIsPaidUser(false);
          }
        } else {
          setIsPaidUser(false);
        }
      } catch (error) {
        console.error('Failed to check paid status:', error);
        setIsPaidUser(false);
      } finally {
        setIsCheckingPaidStatus(false);
      }
    };

    checkPaidStatus();
  }, [session?.user?.uuid]);

  // Check trial status
  useEffect(() => {
    const checkTrialStatus = async () => {
      setIsCheckingTrialStatus(true);
      try {
        const response = await fetch('/api/check-trial-status');
        if (response.ok) {
          const data = await response.json();
          if (data.code === 0) {
            setTrialStatus(data.data);
          } else {
            setTrialStatus({ canUseTrial: false, isTrialUsage: false, isLoggedIn: !!session?.user?.uuid });
          }
        } else {
          setTrialStatus({ canUseTrial: false, isTrialUsage: false, isLoggedIn: !!session?.user?.uuid });
        }
      } catch (error) {
        console.error('Failed to check trial status:', error);
        setTrialStatus({ canUseTrial: false, isTrialUsage: false, isLoggedIn: !!session?.user?.uuid });
      } finally {
        setIsCheckingTrialStatus(false);
      }
    };

    checkTrialStatus();
  }, [session?.user?.uuid]);

  const handleImageSelect = (file: File | string, preview: string) => {
    if (file && preview) {
      setSelectedImage({ file, preview });
    } else {
      setSelectedImage(null);
    }
    // Clear previous results when new image is selected
    setError(null);
  };

  const handleCloseGeneration = () => {
    // Reset all generation-related state
    setShowGenerationView(false);
    setIsGenerating(false);
    setGeneratedImageUrl(null);
    setError(null);
    setSelectedImage(null);
    setNewDrawing(null);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError(t('select_image_first'));
      return;
    }

    // Daily trial now requires login - show login modal if not authenticated
    if (isAuthEnabled() && !session) {
      setShowSignModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    setShowGenerationView(true);
    setNewDrawing({ style: selectedStyle, ratio: selectedRatio });

    // Record start time for calculating total duration
    const startTime = Date.now();
    const targetDuration = isPaidUser === true ? 0 : 50000; // 0ms for paid, 50s for free
    
    // Debug: Log user payment status
    console.log('[DrawingGenerator] isPaidUser:', isPaidUser, 'targetDuration:', targetDuration);

    try {
      let imageData: string;
      
      // Handle sample images (URLs) vs uploaded files
      if (typeof selectedImage.file === 'string') {
        // Sample image - use URL directly
        imageData = selectedImage.file;
      } else {
        // Uploaded file - convert to base64
        imageData = await convertImageToBase64(selectedImage.file);
      }
      
      // Call API immediately for both paid and free users
      const response = await fetch('/api/gen-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: selectedStyle,
          image: imageData,
          ratio: selectedRatio === 'auto' ? null : selectedRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication required - show login modal
          setShowSignModal(true);
          return;
        } else if (response.status === 402) {
          // Insufficient credits - show pricing modal
          setError(data.message || t('insufficient_credits'));
          setShowPricingModal(true);
          return;
        } else if (response.status === 429) {
          // Daily trial already used
          setError(data.message || t('daily_trial_used'));
          return;
        }
        setError(data.message || t('generation_failed'));
        return;
      }

      // API returns {code: 0, message: "ok", data: [...]}
      if (data.code === 0 && data.data) {
        // Calculate elapsed time and remaining wait time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, targetDuration - elapsedTime);
        
        // Debug: Log timing information
        console.log('[DrawingGenerator] API elapsed:', elapsedTime + 'ms', 'remaining wait:', remainingTime + 'ms');
        
        // Wait for remaining time to reach target duration
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Store the generated image URL
        if (data.data[0]?.url) {
          setGeneratedImageUrl(data.data[0].url);
        }
        
        // Clear the new drawing state since generation is complete
        setNewDrawing(null);
        setError(null);
        
        // Refresh trial status after successful generation
        if (trialStatus?.canUseTrial) {
          setTrialStatus(prev => prev ? { ...prev, canUseTrial: false, isTrialUsage: false } : null);
        }
      } else {
        setError(data.message || t('generation_failed'));
        return;
      }
    } catch (err) {
      // Handle network or other unexpected errors quietly
      setError(err instanceof Error ? err.message : t('unexpected_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine button text and cost display
  const getButtonContent = () => {
    if (isGenerating) {
      return (
        <>
          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2" />
          <span className="hidden sm:inline">{t('generating')}</span>
          <span className="sm:hidden">{t('processing')}</span>
        </>
      );
    }

    // Show only text while checking trial status or before status is loaded
    if (isCheckingTrialStatus || trialStatus === null) {
      return (
        <>
          <span className="hidden sm:inline">{t('convert_to_drawing')}</span>
          <span className="sm:hidden">{t('convert')}</span>
        </>
      );
    }

    if (trialStatus?.canUseTrial) {
      return (
        <>
          <span className="hidden sm:inline">{t('convert_to_drawing')}</span>
          <span className="sm:hidden">{t('convert')}</span>
          <RiCoinsLine className="inline-block ml-2" />
          <span className="text-sm">{t('free')}</span>
        </>
      );
    }

    return (
      <>
        <span className="hidden sm:inline">{t('convert_to_drawing')}</span>
        <span className="sm:hidden">{t('convert')}</span>
        <RiCoinsLine className="inline-block ml-2" />
        <span className="text-sm">2</span>
      </>
    );
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto space-y-4 mb-16 sm:space-y-6 px-2", className)}>
      {/* Main Input Card */}
      <div className="border-none py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Left Side - Style Preview + Image Upload OR Generation Progress */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="bg-background border border-border/60 rounded-lg p-6 flex flex-col gap-4 h-[540px] sm:h-[640px] items-center justify-center shadow-sm">
              {showGenerationView ? (
                // Show generation progress/result
                <GenerationProgress
                  isGenerating={isGenerating}
                  generatedImageUrl={generatedImageUrl}
                  error={error}
                  onClose={handleCloseGeneration}
                  className="w-full h-full"
                  isPaidUser={isPaidUser}
                />
              ) : (
                // Show normal style preview and image upload
                <>
                  {/* Style Preview on top - full width */}
                  <div className="w-full flex-shrink-0">
                    <StylePreview
                      selectedStyle={selectedStyle}
                      className=""
                    />
                  </div>
                  
                  {/* Image Upload below - constrained width */}
                  <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      selectedImage={selectedImage}
                      className="h-full w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="md:col-span-1 lg:col-span-1 border border-border/60 space-y-4 rounded-lg shadow-sm">
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              className=""
              popularStylesKey={popularStylesKey}
            />
            
            <RatioSelector
              selectedRatio={selectedRatio}
              onRatioChange={setSelectedRatio}
              className="px-4"
            />
            
            <div className="space-y-1.5 pt-1 px-4 pb-4">
              <Button
                onClick={handleGenerate}
                disabled={!selectedImage || isGenerating || isCheckingTrialStatus}
                className="w-full h-10 text-sm"
                size="lg"
              >
                {getButtonContent()}
              </Button>
              
              {/* Trial hint text */}
              {!session?.user?.uuid ? (
                <p className="text-xs text-center text-muted-foreground">
                  {t('login_for_free_trial_hint')}
                </p>
              ) : trialStatus?.canUseTrial && (
                <p className="text-xs text-center text-muted-foreground">
                  {t('free_trial_available_hint')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Pricing Modal */}
      {pricingData && (
        <PricingModal
          open={showPricingModal}
          onOpenChange={setShowPricingModal}
          pricing={pricingData}
        />
      )}
    </div>
  );
}

export default DrawingGenerator;
