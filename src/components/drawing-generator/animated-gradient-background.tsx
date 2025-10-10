"use client";

import React from 'react';

interface AnimatedGradientBackgroundProps {
  gradientId?: string;
}

export function AnimatedGradientBackground({ 
  gradientId = 'lineGradient1' 
}: AnimatedGradientBackgroundProps) {
  return (
    <div className="absolute inset-0 bg-[#f9f9f9] dark:bg-gray-900">
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/imgs/paper-texture.webp)',
          backgroundRepeat: 'repeat',
          opacity: 0.1,
        }}
      />
      
      {/* Subtle sketch lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.12] pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {/* Diagonal sketch lines */}
        <line x1="10%" y1="15%" x2="45%" y2="20%" stroke="currentColor" strokeWidth="0.5" className="text-gray-800 dark:text-gray-400" />
        <line x1="55%" y1="25%" x2="88%" y2="18%" stroke="currentColor" strokeWidth="0.5" className="text-gray-800 dark:text-gray-400" />
        <line x1="20%" y1="45%" x2="35%" y2="52%" stroke="currentColor" strokeWidth="0.5" className="text-gray-800 dark:text-gray-400" />
        <line x1="65%" y1="55%" x2="82%" y2="48%" stroke="currentColor" strokeWidth="0.5" className="text-gray-800 dark:text-gray-400" />
        <line x1="15%" y1="72%" x2="42%" y2="78%" stroke="currentColor" strokeWidth="0.5" className="text-gray-800 dark:text-gray-400" />
        <line x1="58%" y1="82%" x2="75%" y2="75%" stroke="currentColor" strokeWidth="0.5" className="text-gray-800 dark:text-gray-400" />
        
        {/* Curved sketch strokes */}
        <path d="M 30% 35% Q 40% 38%, 50% 35%" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gray-800 dark:text-gray-400" />
        <path d="M 70% 60% Q 75% 65%, 80% 62%" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gray-800 dark:text-gray-400" />
        <path d="M 25% 88% Q 32% 85%, 38% 90%" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gray-800 dark:text-gray-400" />
      </svg>
    </div>
  );
}
