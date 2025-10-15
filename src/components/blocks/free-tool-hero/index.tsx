import HeroBg from "./bg";
import { Shield, Zap, Database } from "lucide-react";

interface FreeToolHeroProps {
  hero: {
    title: string;
    description: string;
    features?: Array<{
      icon: string;
      text: string;
    }>;
  };
}

export default function FreeToolHero({ hero }: FreeToolHeroProps) {
  // Icon mapping for feature items
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return Shield;
      case 'Zap':
        return Zap;
      case 'Database':
        return Database;
      default:
        return Shield;
    }
  };

  return (
    <>
      <HeroBg />
      <section className="py-6 lg:py-8">
        <div className="container">
          <div className="text-center">
            <h1 className="mx-auto mb-3 mt-2 max-w-4xl text-balance text-3xl font-semibold lg:mb-5 lg:text-5xl">
              {hero.title}
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground text-sm lg:text-base">
              {hero.description}
            </p>

            {hero.features && hero.features.length > 0 && (
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10">
                {hero.features.map((item, index) => {
                  const IconComponent = getIcon(item.icon);
                  return (
                    <div 
                      key={index} 
                      className="flex items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-sm rounded-full"></div>
                        <IconComponent className="relative h-3.5 w-3.5 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-foreground/90">
                        {item.text}
                      </span>
                      {index < (hero.features?.length ?? 0) - 1 && (
                        <div className="ml-3 h-3 w-px bg-border/50"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
