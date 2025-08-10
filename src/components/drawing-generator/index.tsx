"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { StyleSelector } from './style-selector';
import { RatioSelector } from './ratio-selector';
import { ResultDisplay } from './result-display';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratedImage {
  url: string;
  filename: string;
  provider: string;
}

interface DrawingGeneratorProps {
  className?: string;
}

export function DrawingGenerator({ className }: DrawingGeneratorProps) {
  const [selectedImage, setSelectedImage] = useState<{ file: File | string; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('pencil-sketch');
  const [selectedRatio, setSelectedRatio] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | string, preview: string) => {
    if (file && preview) {
      setSelectedImage({ file, preview });
    } else {
      setSelectedImage(null);
    }
    // Clear previous results when new image is selected
    setGeneratedImages([]);
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
      setError('Please select an image first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

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
        throw new Error(data.message || 'Generation failed');
      }

      // API returns {code: 0, message: "ok", data: [...]}
      if (data.code === 0 && data.data) {
        setGeneratedImages(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto space-y-6 px-4", className)}>
      {/* Main Input Card */}
      <Card className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Image Upload */}
          <div className="space-y-4">
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              className="border-0 shadow-none"
            />
          </div>

          {/* Right Side - All Controls */}
          <div className="space-y-6">
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
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Convert to Drawing
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {(isGenerating || generatedImages.length > 0 || error) && (
        <ResultDisplay
          isGenerating={isGenerating}
          generatedImages={generatedImages}
          error={error}
        />
      )}
    </div>
  );
}

export default DrawingGenerator;
