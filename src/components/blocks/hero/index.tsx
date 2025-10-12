import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import HeroBg from "./bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { Gift, Shield, Zap, Fan, CalendarCheck } from "lucide-react";

interface HeroProps {
  hero: HeroType;
  backgroundVariant?: 'default' | 'line-drawing';
}

export default function Hero({ hero, backgroundVariant = 'default' }: HeroProps) {
  if (hero.disabled) {
    return null;
  }

  // Icon mapping for tip items
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gift':
        return Gift;
      case 'Shield':
        return Shield;
      case 'Zap':
        return Zap;
      case 'Fan':
        return Fan;
      case 'CalendarCheck':
        return CalendarCheck;
      default:
        return Gift;
    }
  };

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      <HeroBg />
      <section className="py-4 lg:py-8">
        <div className="container">
          {hero.show_badge && (
            <div className="flex items-center justify-center mb-8">
              <img
                src="/imgs/badges/phdaily.svg"
                alt="phdaily"
                className="h-10 object-cover"
              />
            </div>
          )}
          <div className="text-center">
            {hero.announcement && (
              <Link
                href={hero.announcement.url as any}
                className="mx-auto mb-3 inline-flex bg-white/20 items-center gap-3 border rounded-full  px-2 py-1 text-sm"
              >
                {hero.announcement.label && (
                  <Badge>{hero.announcement.label}</Badge>
                )}
                {hero.announcement.title}
              </Link>
            )}

            {texts && texts.length > 1 ? (
              <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-semibold lg:mb-7 lg:text-6xl">
                {texts[0]}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FC5C7D] to-[#5e52d0] snipcss0-3-5-8">
                  {highlightText}
                </span>
                {texts[1]}
              </h1>
            ) : (
              <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                {hero.title}
              </h1>
            )}

            <p
              className="m mx-auto max-w-3xl text-muted-foreground text-md lg:text-lg"
              dangerouslySetInnerHTML={{ __html: hero.description || "" }}
            />
            {hero.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {hero.buttons.map((item, i) => {
                  return (
                    <Link
                      key={i}
                      href={item.url as any}
                      target={item.target || ""}
                      className="flex items-center"
                    >
                      <Button
                        className="w-full text-md py-6 rounded-full"
                        size="lg"
                        variant={item.variant || "default"}
                      >
                        {item.icon && <Icon name={item.icon} className="" />}
                        {item.title}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
            {hero.tip_items && hero.tip_items.length > 0 && (
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10">
                {hero.tip_items.map((item, index) => {
                  const IconComponent = getIcon(item.icon);
                  return (
                    <div 
                      key={index} 
                      className="flex items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-sm rounded-full"></div>
                        <IconComponent className="relative h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <span className="text-xs font-medium text-foreground/90">
                        {item.text}
                      </span>
                      {index < (hero.tip_items?.length ?? 0) - 1 && (
                        <div className="ml-3 h-3 w-px bg-border/50"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {hero.show_happy_users && <HappyUsers />}
          </div>
        </div>
      </section>
    </>
  );
}
