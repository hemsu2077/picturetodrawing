import React from 'react';
import DrawingGenerator from '@/components/drawing-generator';

export default function DrawingGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Drawing Generator</h1>
          <p className="text-muted-foreground">
            Transform your photos into beautiful drawings with AI
          </p>
        </div>
        <DrawingGenerator />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'AI Drawing Generator - Transform Photos to Art',
  description: 'Transform your photos into beautiful drawings with AI. Choose from multiple artistic styles including pencil sketch, watercolor, and more.',
};
