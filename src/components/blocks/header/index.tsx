"use client";

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
import { useRouter } from "@/i18n/navigation";

export default function Header({ header }: { header: HeaderType }) {
  const router = useRouter();

  if (header.disabled) {
    return null;
  }

  const handleFreeCreditsClick = (e: React.MouseEvent, url: string) => {
    // Navigate to the URL - the page will handle showing login landing if needed
    router.push(url);
  };

  return (
    <section className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <nav className="hidden h-14 items-center justify-between lg:flex">
          <div className="flex items-center gap-3">
            <Link
              href={(header.brand?.url as any) || "/"}
              className="flex items-center gap-2 shrink-0"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-7 h-7"
                />
              )}
              {header.brand?.title && (
                <span className="text-lg text-primary font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                {/* remove extra gap to make top-level menu tighter */}
                <NavigationMenuList className="gap-0">
                  {header.nav?.items?.map((item, i) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem
                          key={i}
                          className="text-muted-foreground"
                        >
                          <NavigationMenuTrigger className="h-9 px-3 text-sm">
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0 mr-1.5"
                              />
                            )}
                            <span>{item.title}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-0 p-2">
                              {item.children.map((iitem, ii) => (
                                <li key={ii}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      className={cn(
                                        // Align icon and text; keep hover radius explicitly small
                                        "flex items-center select-none gap-3 rounded-[4px] hover:rounded-[4px] focus:rounded-[4px] p-2.5 leading-none no-underline outline-hidden transition-colors hover:bg-accent/40 focus:bg-accent/40"
                                      )}
                                      href={iitem.url as any}
                                      target={iitem.target}
                                    >
                                      {iitem.icon && (
                                        <Icon
                                          name={iitem.icon}
                                          className="w-[16px] h-[16px] shrink-0 text-primary"
                                        />
                                      )}
                                      <div className="space-y-0">
                                        <div className="text-[13px] font-medium leading-none">
                                          {iitem.title}
                                        </div>
                                        <p className="text-[11px] leading-snug text-muted-foreground line-clamp-2">
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
                            "text-muted-foreground h-9 px-3 text-sm",
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
                              className="size-4 shrink-0 mr-1.5"
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
          <div className="shrink-0 flex gap-1.5 items-center">

            {header.buttons?.map((item, i) => {
              return (
                <Button 
                  key={i} 
                  variant={item.variant}
                  size="sm"
                  className={cn(
                    "h-9 px-3 text-sm",
                    item.url === "/free-credits" && 
                    "bg-transparent border-none hover:bg-gradient-to-r from-purple-50/80 to-orange-50/80 text-primary hover:text-purple-800 shadow-none hover:shadow-sm transition-all duration-200"
                  )}
                  onClick={(e) => handleFreeCreditsClick(e, item.url as string)}
                >
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    {item.icon && (
                      <Icon 
                        name={item.icon} 
                        className={cn(
                          "size-4 shrink-0",
                          item.url === "/free-credits" && "text-orange-500"
                        )} 
                      />
                    )}
                    {item.title}
                  </div>
                </Button>
              );
            })}
                        {header.show_locale && <LocaleToggle />}
                        {header.show_theme && <ThemeToggle />}
            {header.show_sign && <SignToggle />}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex h-14 items-center justify-between">
            <Link
              href={(header.brand?.url || "/") as any}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-7 h-7"
                />
              )}
              {header.brand?.title && (
                <span className="text-lg font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px] overflow-y-auto p-0">
                <SheetHeader className="border-b px-6 py-4">
                  <SheetTitle>
                    <Link
                      href={(header.brand?.url || "/") as any}
                      className="flex items-center gap-2"
                    >
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src}
                          alt={header.brand.logo.alt || header.brand.title}
                          className="w-7 h-7"
                        />
                      )}
                      {header.brand?.title && (
                        <span className="text-lg font-bold">
                          {header.brand?.title || ""}
                        </span>
                      )}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100vh-5rem)]">
                  <nav className="flex-1 py-4">
                    {header.nav?.items?.map((item, i) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <div key={i} className="mb-4">
                            <div className="px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                              {item.icon && (
                                <Icon
                                  name={item.icon}
                                  className="size-3.5 shrink-0"
                                />
                              )}
                              {item.title}
                            </div>
                            <div className="mt-1 space-y-0.5">
                              {item.children.map((iitem, ii) => (
                                <Link
                                  key={ii}
                                  className={cn(
                                    "flex items-start gap-3 px-6 py-2.5 text-sm transition-colors hover:bg-accent/50 active:bg-accent"
                                  )}
                                  href={iitem.url as any}
                                  target={iitem.target}
                                >
                                  {iitem.icon && (
                                    <Icon
                                      name={iitem.icon}
                                      className="size-4 shrink-0 mt-0.5 text-primary"
                                    />
                                  )}
                                  <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="font-medium text-foreground leading-tight">
                                      {iitem.title}
                                    </span>
                                    {iitem.description && (
                                      <span className="text-xs text-muted-foreground leading-tight line-clamp-2">
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
                          className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent/50 active:bg-accent"
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0 text-primary"
                            />
                          )}
                          <span className="text-foreground">{item.title}</span>
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="border-t px-6 py-4 space-y-3">
                    {header.buttons?.map((item, i) => {
                      return (
                        <Button 
                          key={i} 
                          variant={item.variant}
                          size="sm"
                          className={cn(
                            "w-full h-9 text-sm",
                            item.url === "/free-credits" && 
                            "border-none bg-gradient-to-r from-purple-50/80 to-orange-50/80 hover:from-purple-100/90 hover:to-orange-100/90 text-primary/90 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200"
                          )}
                          onClick={(e) => handleFreeCreditsClick(e, item.url as string)}
                        >
                          <div className="flex items-center gap-1.5">
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className={cn(
                                  "size-4 shrink-0",
                                  item.url === "/free-credits" && "text-orange-500"
                                )}
                              />
                            )}
                            {item.title}
                          </div>
                        </Button>
                      );
                    })}

                    {header.show_sign && <SignToggle />}

                    <div className="flex items-center gap-2 pt-2">
                      {header.show_locale && <LocaleToggle />}
                      <div className="flex-1"></div>
                      {header.show_theme && <ThemeToggle />}
                    </div>
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
