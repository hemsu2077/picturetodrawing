'use client';

import { StyleCard } from './style-card';
import { StyleOption } from '@/config/drawing-styles';
import { StyleMetadata } from '@/config/style-categories';

interface CategorySectionProps {
  id: string;
  name: string;
  description: string;
  styles: StyleOption[];
  styleMetadata: Record<string, StyleMetadata>;
}

export function CategorySection({
  id,
  name,
  description,
  styles,
  styleMetadata
}: CategorySectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      {/* Category Header */}
      <div className="space-y-3 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {name}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {description}
        </p>
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {styles.map((style) => {
          const metadata = styleMetadata[style.id];
          return (
            <StyleCard
              key={style.id}
              id={style.id}
              name={style.name}
              image={style.image}
              description={metadata?.description || ''}
              hasLandingPage={metadata?.hasLandingPage}
              landingPageUrl={metadata?.landingPageUrl}
            />
          );
        })}
      </div>
    </section>
  );
}
