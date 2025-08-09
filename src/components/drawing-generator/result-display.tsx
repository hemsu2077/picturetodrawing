"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratedImage {
  url: string;
  filename: string;
  provider: string;
}

interface ResultDisplayProps {
  isGenerating: boolean;
  generatedImages: GeneratedImage[];
  error?: string | null;
  className?: string;
}

export function ResultDisplay({ 
  isGenerating, 
  generatedImages, 
  error, 
  className 
}: ResultDisplayProps) {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (isGenerating) {
    return (
      <Card className={cn("p-8", className)}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Generating Your Drawing</h3>
            <p className="text-sm text-muted-foreground">
              This may take a few moments...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-8", className)}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-destructive text-xl">⚠</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-destructive">Generation Failed</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (generatedImages.length === 0) {
    return null;
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Generated Drawing</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your image has been transformed successfully!
          </p>
        </div>
        
        <div className="space-y-4">
          {generatedImages.map((image, index) => (
            <div key={index} className="space-y-4">
              <div className="relative group max-w-2xl mx-auto">
                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={image.url}
                    alt={`Generated drawing ${index + 1}`}
                    className="max-w-full max-h-full object-contain shadow-md rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center">
               
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(image.url, image.filename)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
