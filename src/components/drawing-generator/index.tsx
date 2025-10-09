"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { StyleSelector } from './style-selector';
import { StylePreview } from './style-preview';
import { RatioSelector } from './ratio-selector';
import { RecentDrawings } from './result-display';
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
  const [trialResult, setTrialResult] = useState<any>(null);
  const resultDisplayRef = useRef<HTMLDivElement>(null);

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
          if (data.code === 0) {
            setIsPaidUser(data.data.isPaid);
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
    setNewDrawing({ style: selectedStyle, ratio: selectedRatio });

    // scroll to result display area
    setTimeout(() => {
      resultDisplayRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);

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
         // Only paid users get instant results, everyone else waits
         if (isPaidUser !== true) {
          await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds
        }
        
        // Store the result for display after waiting (if needed)
        setTrialResult(data.data);
        
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
      <Card className="p-4 border-none">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Side - Style Preview & Image Upload in a container (2 columns) */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="max-w-md mx-auto">
                <StylePreview
                  selectedStyle={selectedStyle}
                  className=""
                />
              </div>
              <div className="max-w-md mx-auto">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  className=""
                />
              </div>
            </div>
          </div>

          {/* Right Side - Controls (1 column) */}
          <div className="lg:col-span-1 space-y-4">
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              className=""
              popularStylesKey={popularStylesKey}
            />
            
            <RatioSelector
              selectedRatio={selectedRatio}
              onRatioChange={setSelectedRatio}
              className=""
            />
            
            <div className="space-y-1.5 pt-1">
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
      </Card>

      {/* Recent Drawings */}
      <div ref={resultDisplayRef}>
        <RecentDrawings
          isGenerating={isGenerating}
          newDrawing={newDrawing}
          error={error}
          isPaidUser={isPaidUser}
          trialResult={trialResult}
        />
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
