"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale/toggle";
import { Menu } from "lucide-react";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/app";
import { isAuthEnabled } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";

export default function Header({ header }: { header: HeaderType }) {
  const { user, setShowSignModal } = useAppContext();
  const router = useRouter();

  if (header.disabled) {
    return null;
  }

  const handleFreeCreditsClick = (e: React.MouseEvent, url: string) => {
    // Check if this is the Free Credits button and auth is enabled
    if (url.includes('/free-credits') && isAuthEnabled() && !user) {
      e.preventDefault();
      setShowSignModal(true);
      return;
    }
    // For other buttons or when user is logged in, proceed normally
    router.push(url);
  };

  return (
    <section className="py-3">
      <div className="container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link
              href={(header.brand?.url as any) || "/"}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl text-primary font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {header.nav?.items?.map((item, i) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem
                          key={i}
                          className="text-muted-foreground"
                        >
                          <NavigationMenuTrigger>
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0 mr-2"
                              />
                            )}
                            <span>{item.title}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-80 p-3">
                              {item.children.map((iitem, ii) => (
                                <li key={ii}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      className={cn(
                                        "flex select-none gap-4 rounded-lg p-3 leading-none no-underline outline-hidden transition-colors hover:bg-muted focus:bg-muted"
                                      )}
                                      href={iitem.url as any}
                                      target={iitem.target}
                                    >
                                      {iitem.icon && (
                                        <Icon
                                          name={iitem.icon}
                                          className="size-5 shrink-0"
                                        />
                                      )}
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {iitem.title}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {iitem.description}
                                        </p>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={i}>
                        <Link
                          className={cn(
                            "text-muted-foreground",
                            navigationMenuTriggerStyle,
                            buttonVariants({
                              variant: "ghost",
                            })
                          )}
                          href={item.url as any}
                          target={item.target}
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0 mr-0"
                            />
                          )}
                          {item.title}
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="shrink-0 flex gap-2 items-center">
            {header.show_locale && <LocaleToggle />}
            {header.show_theme && <ThemeToggle />}

            {header.buttons?.map((item, i) => {
              return (
                <Button 
                  key={i} 
                  variant={item.variant}
                  className={cn(
                    item.title === "Free Credits" && 
                    "border-none bg-gradient-to-r from-purple-50/80 to-orange-50/80 hover:from-purple-100/90 hover:to-orange-100/90 text-primary hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200"
                  )}
                  onClick={(e) => handleFreeCreditsClick(e, item.url as string)}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    {item.icon && (
                      <Icon 
                        name={item.icon} 
                        className={cn(
                          "size-4 shrink-0",
                          item.title === "Free Credits" && "text-orange-500"
                        )} 
                      />
                    )}
                    {item.title}
                  </div>
                </Button>
              );
            })}
            {header.show_sign && <SignToggle />}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href={(header.brand?.url || "/") as any}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={(header.brand?.url || "/") as any}
                      className="flex items-center gap-2"
                    >
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src}
                          alt={header.brand.logo.alt || header.brand.title}
                          className="w-8"
                        />
                      )}
                      {header.brand?.title && (
                        <span className="text-xl font-bold">
                          {header.brand?.title || ""}
                        </span>
                      )}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="mb-8 mt-6 flex flex-col">
                  <nav className="space-y-1">
                    {header.nav?.items?.map((item, i) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <div key={i} className="space-y-1">
                            <div className="px-4 py-3 text-sm font-semibold text-foreground border-b border-border/50">
                              {item.title}
                            </div>
                            <div className="space-y-1 pb-4">
                              {item.children.map((iitem, ii) => (
                                <Link
                                  key={ii}
                                  className={cn(
                                    "flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-muted rounded-lg mx-2"
                                  )}
                                  href={iitem.url as any}
                                  target={iitem.target}
                                >
                                  {iitem.icon && (
                                    <Icon
                                      name={iitem.icon}
                                      className="size-5 shrink-0 text-muted-foreground"
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">
                                      {iitem.title}
                                    </span>
                                    {iitem.description && (
                                      <span className="text-xs text-muted-foreground mt-0.5">
                                        {iitem.description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={i}
                          href={item.url as any}
                          target={item.target}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted rounded-lg mx-2"
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-5 shrink-0 text-muted-foreground"
                            />
                          )}
                          <span className="text-foreground">{item.title}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                <div className="flex-1"></div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-3">
                    {header.buttons?.map((item, i) => {
                      return (
                        <Button 
                          key={i} 
                          variant={item.variant}
                          className={cn(
                            item.title === "Free Credits" && 
                            "border-none bg-gradient-to-r from-purple-50/80 to-orange-50/80 hover:from-purple-100/90 hover:to-orange-100/90 text-primary/90 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200"
                          )}
                          onClick={(e) => handleFreeCreditsClick(e, item.url as string)}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className={cn(
                                  "size-4 shrink-0",
                                  item.title === "Free Credits" && "text-orange-500"
                                )}
                              />
                            )}
                            {item.title}
                          </div>
                        </Button>
                      );
                    })}

                    {header.show_sign && <SignToggle />}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {header.show_locale && <LocaleToggle />}
                    <div className="flex-1"></div>

                    {header.show_theme && <ThemeToggle />}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
