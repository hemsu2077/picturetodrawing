import React from 'react';
import DrawingGenerator from '@/components/drawing-generator';

export default function DrawingGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <DrawingGenerator />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'AI Drawing Generator - Transform Photos to Art',
  description: 'Transform your photos into beautiful drawings with AI. Choose from multiple artistic styles including pencil sketch, watercolor, and more.',
};
