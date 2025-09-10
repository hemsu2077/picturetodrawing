import { Pathnames } from "next-intl/routing";

export const locales = ["en", "fr", "de", "zh", "zh-tw"];

export const localeNames: any = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  zh: "中文(简)",
  "zh-tw": "中文(繁)",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "false";
