'use client';

import { StyleCard } from './style-card';
import { StyleOption } from '@/config/drawing-styles';
import { STYLE_METADATA } from '@/config/style-categories';

interface CategorySectionProps {
  id: string;
  name: string;
  description: string;
  styles: StyleOption[];
  styleMetadata: {
    [key: string]: {
      description?: string;
    };
  };
  styleCardLabels?: {
    learn_more?: string;
    try_now?: string;
  };
}

export function CategorySection({
  id,
  name,
  description,
  styles,
  styleMetadata,
  styleCardLabels
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
          const i18nMetadata = styleMetadata[style.id];
          const staticMetadata = STYLE_METADATA[style.id];
          return (
            <StyleCard
              key={style.id}
              id={style.id}
              name={style.name}
              image={style.image}
              description={i18nMetadata?.description || staticMetadata?.description || ''}
              hasLandingPage={staticMetadata?.hasLandingPage}
              landingPageUrl={staticMetadata?.landingPageUrl}
              learnMoreLabel={styleCardLabels?.learn_more}
              tryNowLabel={styleCardLabels?.try_now}
            />
          );
        })}
      </div>
    </section>
  );
}
