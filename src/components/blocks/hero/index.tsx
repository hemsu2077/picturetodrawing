import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import HeroBg from "./bg";
import LineDrawingBg from "./line-drawing-bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { Gift, Shield, Zap } from "lucide-react";

interface HeroProps {
  hero: HeroType;
  backgroundVariant?: 'default' | 'line-drawing';
}

export default function Hero({ hero, backgroundVariant = 'default' }: HeroProps) {
  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      {backgroundVariant === 'line-drawing' ? <LineDrawingBg /> : <HeroBg />}
      <section className="py-12 lg:py-24">
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
              <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-semibold lg:mb-7 lg:text-7xl">
                {texts[0]}
                <span className="bg-clip-text text-transparent bg-gradient-to-r dark:from-indigo-300 via-foreground/90 dark:to-rose-300 from-indigo-800 to-rose-700 snipcss0-3-5-8">
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
              className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl"
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
                        className="w-full"
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
            {hero.tip && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Free to Try</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">No Sign-up Required</span>
                </div>
              </div>
            )}
            {hero.show_happy_users && <HappyUsers />}
          </div>
        </div>
      </section>
    </>
  );
}
