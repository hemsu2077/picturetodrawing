"use client";

import React from 'react';

interface AnimatedGradientBackgroundProps {
  gradientId?: string;
}

export function AnimatedGradientBackground({ 
  gradientId = 'lineGradient1' 
}: AnimatedGradientBackgroundProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20">
      {/* Flowing energy orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse" 
        style={{ animationDuration: '4s', animationDelay: '0s' }} 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse" 
        style={{ animationDuration: '5s', animationDelay: '1s' }} 
      />
      <div 
        className="absolute top-1/2 right-1/3 w-56 h-56 bg-pink-400/10 dark:bg-pink-400/5 rounded-full blur-3xl animate-pulse" 
        style={{ animationDuration: '6s', animationDelay: '2s' }} 
      />
      
      {/* Subtle flowing lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path 
          d="M0,100 Q250,50 500,100 T1000,100" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="1" 
          fill="none" 
          className="animate-pulse" 
          style={{ animationDuration: '3s' }} 
        />
        <path 
          d="M0,200 Q250,150 500,200 T1000,200" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="1" 
          fill="none" 
          className="animate-pulse" 
          style={{ animationDuration: '4s', animationDelay: '0.5s' }} 
        />
        <path 
          d="M0,300 Q250,250 500,300 T1000,300" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="1" 
          fill="none" 
          className="animate-pulse" 
          style={{ animationDuration: '5s', animationDelay: '1s' }} 
        />
      </svg>
    </div>
  );
}
