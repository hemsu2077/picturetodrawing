import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppContextProvider } from "@/contexts/app";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return {
    title: {
      template: `%s`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Normalize locale to match our message filenames
  let effectiveLocale = locale;
  if (effectiveLocale === "zh-CN") effectiveLocale = "zh";
  if (effectiveLocale === "zh-TW") effectiveLocale = "zh-tw";
  if (!routing.locales.includes(effectiveLocale as any)) {
    effectiveLocale = routing.defaultLocale;
  }

  // Explicitly import messages by locale to avoid SSG defaulting to en
  let messages: any;
  try {
    messages = (await import(`@/i18n/messages/${effectiveLocale}.json`)).default;
  } catch (e) {
    messages = (await import(`@/i18n/messages/en.json`)).default;
    effectiveLocale = "en";
  }

  return (
    <NextIntlClientProvider locale={effectiveLocale} messages={messages}>
      <NextAuthSessionProvider>
        <AppContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppContextProvider>
      </NextAuthSessionProvider>
    </NextIntlClientProvider>
  );
}

// Pre-render all locales so SSR serves the correct messages per locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
