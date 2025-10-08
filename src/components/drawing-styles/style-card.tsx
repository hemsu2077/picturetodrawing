'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';

interface StyleCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  hasLandingPage?: boolean;
  landingPageUrl?: string;
  className?: string;
}

export function StyleCard({
  id,
  name,
  image,
  description,
  hasLandingPage = false,
  landingPageUrl,
  className
}: StyleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Always include style parameter
    const styleParam = `?style=${id}#drawing-generator`;
    
    if (hasLandingPage && landingPageUrl) {
      // Navigate to landing page with style parameter
      router.push(`${landingPageUrl}${styleParam}`);
    } else {
      // Navigate to homepage with style parameter
      router.push(`/${styleParam}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={`${name} style example`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
        
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{hasLandingPage ? 'Learn More' : 'Try Now'}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}
