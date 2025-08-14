"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { StyleSelector } from './style-selector';
import { RatioSelector } from './ratio-selector';
import { RecentDrawings } from './result-display';
import PricingModal from '@/components/pricing-modal';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/contexts/app';
import { isAuthEnabled } from '@/lib/auth';
import { useLocale } from 'next-intl';
import { Pricing } from '@/types/blocks/pricing';

interface DrawingGeneratorProps {
  className?: string;
}

export function DrawingGenerator({ className }: DrawingGeneratorProps) {
  const { data: session } = isAuthEnabled() ? useSession() : { data: null };
  const { setShowSignModal, showPricingModal, setShowPricingModal } = useAppContext();
  const locale = useLocale();
  
  const [selectedImage, setSelectedImage] = useState<{ file: File | string; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('pencil-sketch');
  const [selectedRatio, setSelectedRatio] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDrawing, setNewDrawing] = useState<{ style: string; ratio: string } | null>(null);
  const [pricingData, setPricingData] = useState<Pricing | null>(null);

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
    // Check if user is logged in (only if auth is enabled)
    if (isAuthEnabled() && !session) {
      setShowSignModal(true);
      return;
    }

    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setNewDrawing({ style: selectedStyle, ratio: selectedRatio });

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
          setError(data.message || 'Insufficient credits');
          setShowPricingModal(true);
          return;
        }
        setError(data.message || 'Generation failed');
        return;
      }

      // API returns {code: 0, message: "ok", data: [...]}
      if (data.code === 0 && data.data) {
        // Clear the new drawing state since generation is complete
        setNewDrawing(null);
        setError(null);
      } else {
        setError(data.message || 'Invalid response format');
        return;
      }
    } catch (err) {
      // Handle network or other unexpected errors quietly
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4", className)}>
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
            <RatioSelector
              selectedRatio={selectedRatio}
              onRatioChange={setSelectedRatio}
              className="border-0 shadow-none p-0"
            />
            
            <Button
              onClick={handleGenerate}
              disabled={!selectedImage || isGenerating}
              className="w-full h-11 sm:h-12 text-base sm:text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Processing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">Convert to Drawing</span>
                  <span className="sm:hidden">Convert</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Drawings */}
      <RecentDrawings
        isGenerating={isGenerating}
        newDrawing={newDrawing}
        error={error}
      />

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
