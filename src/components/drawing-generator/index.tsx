"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { StyleSelector } from './style-selector';
import { ModelSelector } from './model-selector';
import { RatioSelector } from './ratio-selector';
import { RecentDrawings } from './result-display';
import PricingModal from '@/components/pricing-modal';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/contexts/app';
import { isAuthEnabled } from '@/lib/auth';
import { useLocale, useTranslations } from 'next-intl';
import { Pricing } from '@/types/blocks/pricing';
import { RiCoinsLine } from 'react-icons/ri';

interface DrawingGeneratorProps {
  className?: string;
  defaultStyle?: string;
  defaultModel?: string;
}

interface TrialStatus {
  canUseTrial: boolean;
  isTrialUsage: boolean;
  isLoggedIn: boolean;
}

export function DrawingGenerator({ className, defaultStyle = 'pencil-sketch', defaultModel = 'default' }: DrawingGeneratorProps) {
  const { data: session } = isAuthEnabled() ? useSession() : { data: null };
  const { setShowSignModal, showPricingModal, setShowPricingModal } = useAppContext();
  const locale = useLocale();
  const t = useTranslations();
  
  const [selectedImage, setSelectedImage] = useState<{ file: File | string; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [selectedRatio, setSelectedRatio] = useState('auto');

  // Auto-set ratio to 'auto' when nano-banana is selected
  useEffect(() => {
    if (selectedModel === 'nano-banana') {
      setSelectedRatio('auto');
    }
  }, [selectedModel]);
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
      setError(t('drawing_generator.select_image_first'));
      return;
    }

    // Check if user needs authentication (only if auth is enabled and no trial available)
    if (isAuthEnabled() && !session && !trialStatus?.canUseTrial) {
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
          model: selectedModel,
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
          setError(data.message || t('drawing_generator.insufficient_credits'));
          setShowPricingModal(true);
          return;
        } else if (response.status === 429) {
          // Daily trial already used
          setError(data.message || t('drawing_generator.daily_trial_used'));
          return;
        }
        setError(data.message || t('drawing_generator.generation_failed'));
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
        setError(data.message || t('drawing_generator.generation_failed'));
        return;
      }
    } catch (err) {
      // Handle network or other unexpected errors quietly
      setError(err instanceof Error ? err.message : t('drawing_generator.unexpected_error'));
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
          <span className="hidden sm:inline">{t('drawing_generator.generating')}</span>
          <span className="sm:hidden">{t('drawing_generator.processing')}</span>
        </>
      );
    }

    // Show only text while checking trial status or before status is loaded
    if (isCheckingTrialStatus || trialStatus === null) {
      return (
        <>
          <span className="hidden sm:inline">{t('drawing_generator.convert_to_drawing')}</span>
          <span className="sm:hidden">{t('drawing_generator.convert')}</span>
        </>
      );
    }

    if (trialStatus?.canUseTrial) {
      return (
        <>
          <span className="hidden sm:inline">{t('drawing_generator.convert_to_drawing')}</span>
          <span className="sm:hidden">{t('drawing_generator.convert')}</span>
          <RiCoinsLine className="inline-block ml-2" />
          <span className="text-sm">{t('drawing_generator.free')}</span>
        </>
      );
    }

    return (
      <>
        <span className="hidden sm:inline">{t('drawing_generator.convert_to_drawing')}</span>
        <span className="sm:hidden">{t('drawing_generator.convert')}</span>
        <RiCoinsLine className="inline-block ml-2" />
        <span className="text-sm">2</span>
      </>
    );
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto space-y-4 mb-16 sm:space-y-6 px-2 sm:px-4", className)}>
      {/* Main Input Card */}
      <Card className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Side - Image Upload */}
          <div className="space-y-3 sm:space-y-4">
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              className="border-0 shadow-none"
            />
          </div>

          {/* Right Side - All Controls */}
          <div className="space-y-4 sm:space-y-6">
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              className="border-0 shadow-none p-0"
            />
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              className="border-0 shadow-none p-0"
            />
            <RatioSelector
              selectedRatio={selectedRatio}
              onRatioChange={setSelectedRatio}
              disabled={selectedModel === 'nano-banana'}
              className="border-0 shadow-none p-0"
            />
            
            <div className="space-y-2">
              <Button
                onClick={handleGenerate}
                disabled={!selectedImage || isGenerating || isCheckingTrialStatus}
                className="w-full h-11 sm:h-12 text-base sm:text-lg"
                size="lg"
              >
                {getButtonContent()}
              </Button>
              
              {/* Trial hint text */}
              {!session?.user?.uuid && (
                <p className="text-xs text-center text-muted-foreground">
                  {trialStatus?.canUseTrial 
                    ? t('drawing_generator.try_free_hint')
                    : t('drawing_generator.signup_free_credits_hint')
                  }
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
