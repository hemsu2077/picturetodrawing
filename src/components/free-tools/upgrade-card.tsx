"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, History, Zap, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface UpgradeCardProps {
  className?: string;
  title: string;
  description: string;
  features: Array<{
    icon: string;
    text: string;
  }>;
  ctaText: string;
  ctaLink: string;
  styleImage: string;
}

export function UpgradeCard({
  className,
  title,
  description,
  features,
  ctaText,
  ctaLink,
  styleImage,
}: UpgradeCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Palette":
        return Palette;
      case "Zap":
        return Zap;
      case "History":
        return History;
      case "Sparkles":
        return Sparkles;
      default:
        return Sparkles;
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row gap-6 p-4">
        {/* Left: Style Preview Image */}
        <div className="flex items-center justify-center sm:justify-start flex-shrink-0">
          <div className="relative w-[240px] aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted/30">
            <Image
              src={styleImage}
              alt="Picture to Drawing AI Example"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 200px"
              unoptimized
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center space-y-4 flex-1">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2.5">
            {features.map((feature, index) => {
              const IconComponent = getIcon(feature.icon);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs text-foreground/80"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <IconComponent className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Link href={ctaLink}>
              <Button
                size="sm"
                className="group h-9 text-xs font-medium gap-1.5"
              >
                {ctaText}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}
