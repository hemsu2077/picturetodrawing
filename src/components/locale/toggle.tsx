"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useParams, usePathname, useRouter } from "next/navigation";

import { MdLanguage } from "react-icons/md";
import { localeNames } from "@/i18n/locale";

export default function ({ isIcon = false }: { isIcon?: boolean }) {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchLanguage = (value: string) => {
    if (value !== locale) {
      // More precise path replacement - only replace at the beginning
      let newPathName = pathname;
      if (pathname.startsWith(`/${locale}/`)) {
        // Replace locale at the beginning of path
        newPathName = pathname.replace(`/${locale}/`, `/${value}/`);
      } else if (pathname === `/${locale}`) {
        // Handle root locale path
        newPathName = `/${value}`;
      } else {
        // Fallback: prepend new locale
        newPathName = `/${value}${pathname}`;
      }
      router.push(newPathName);
    }
  };

  return (
    <Select value={locale} onValueChange={handleSwitchLanguage}>
      <SelectTrigger className="flex items-center gap-2 border-none text-muted-foreground outline-hidden hover:bg-transparent focus:ring-0 focus:ring-offset-0">
        <MdLanguage className="text-xl" />
        {!isIcon && (
          <span className="hidden md:block">{localeNames[locale]}</span>
        )}
      </SelectTrigger>
      <SelectContent className="z-50 bg-background">
        {Object.keys(localeNames).map((key: string) => {
          const name = localeNames[key];
          return (
            <SelectItem className="cursor-pointer px-4" key={key} value={key}>
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
