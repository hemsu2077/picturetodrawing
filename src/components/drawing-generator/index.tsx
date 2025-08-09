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
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('pencil-sketch');
  const [selectedRatio, setSelectedRatio] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
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
      const base64Image = await convertImageToBase64(selectedImage.file);
      
      console.log('🚀 Sending request with:', {
        style: selectedStyle,
        imageSize: base64Image.length,
        ratio: selectedRatio === 'auto' ? null : selectedRatio,
      });
      
      const response = await fetch('/api/gen-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: selectedStyle,
          image: base64Image,
          ratio: selectedRatio === 'auto' ? null : selectedRatio,
        }),
      });

      const data = await response.json();
      console.log('✅ API response:', data);

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
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>

      {/* Image Upload */}
      <ImageUpload
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage}
      />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
        />
        <RatioSelector
          selectedRatio={selectedRatio}
          onRatioChange={setSelectedRatio}
        />
      </div>

      {/* Generate Button */}
      <Card className="p-6">
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
