"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { useLocale } from "next-intl";
import LazyToaster from "@/components/lazy-toaster";
import { isAuthEnabled } from "@/lib/auth";
import SignModal from "@/components/sign/modal";
import Analytics from "@/components/analytics";
import Adsense from "./adsense";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={process.env.NEXT_PUBLIC_DEFAULT_THEME || "system"}
      enableSystem
      disableTransitionOnChange
    >
      {children}

      <LazyToaster />
      <Analytics />

      {isAuthEnabled() && <SignModal />}

      <Adsense />
    </NextThemesProvider>
  );
}
