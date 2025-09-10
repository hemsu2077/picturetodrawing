import { LandingPage, PricingPage, ShowcasePage, PhotoToLineDrawingPage } from "@/types/pages/landing";
import { FreeCreditsPage } from "@/types/pages/free-credits";

export async function getLandingPage(locale: string): Promise<LandingPage> {
  return (await getPage("landing", locale)) as LandingPage;
}

export async function getPricingPage(locale: string): Promise<PricingPage> {
  return (await getPage("pricing", locale)) as PricingPage;
}

export async function getShowcasePage(locale: string): Promise<ShowcasePage> {
  return (await getPage("showcase", locale)) as ShowcasePage;
}

export async function getPhotoToLineDrawingPage(locale: string): Promise<PhotoToLineDrawingPage> {
  return (await getPage("photo-to-line-drawing", locale)) as PhotoToLineDrawingPage;
}

export async function getFreeCreditsPage(locale: string): Promise<FreeCreditsPage> {
  return (await getPage("free-credits", locale)) as FreeCreditsPage;
}

export async function getPage(
  name: string,
  locale: string
): Promise<LandingPage | PricingPage | ShowcasePage | PhotoToLineDrawingPage | FreeCreditsPage> {
  try {
    if (locale === "zh-CN") {
      locale = "zh";
    }

    return await import(
      `@/i18n/pages/${name}/${locale.toLowerCase()}.json`
    ).then((module) => module.default);
  } catch (error) {
    console.warn(`Failed to load ${locale}.json, falling back to en.json`);

    return await import(`@/i18n/pages/${name}/en.json`).then(
      (module) => module.default
    );
  }
}
