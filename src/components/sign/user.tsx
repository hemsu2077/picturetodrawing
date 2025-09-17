"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/navigation";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { NavItem } from "@/types/blocks/base";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";

interface UserCredits {
  left_credits: number;
  is_pro?: boolean;
  is_recharged?: boolean;
}

export default function SignUser({ user }: { user: User }) {
  const t = useTranslations();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-user-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === 0) {
          setCredits(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const dropdownItems: NavItem[] = [
    {
      title: t("user.user_center"),
      url: "/my-account",
      icon: "RiUserLine",
    },
    {
      title: t("user.my_drawings"),
      url: "/my-drawings",
      icon: "RiImageLine",
    },
    {
      title: t("user.my_orders"),
      url: "/my-orders",
      icon: "RiFileListLine",
    },
    {
      title: t("user.sign_out"),
      onClick: () => signOut(),
      icon: "RiLogoutBoxLine",
    },
  ];

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open && !credits) {
        fetchCredits();
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.avatar_url} alt={user.nickname} />
          <AvatarFallback>{user.nickname}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background" align="end">
        {/* User Info Section */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar_url} alt={user.nickname} />
              <AvatarFallback>{user.nickname}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nickname}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Credits Section */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
            <Icon name="RiCoinsLine" className="w-4 h-4 text-primary" />
            {loading ? (
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-sm font-bold text-primary">
                {credits?.left_credits || 0}
              </span>
            )}
            </div>
            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">
              <Link href="/pricing" target="_self">
                {t("user.recharge")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          {dropdownItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-2 cursor-pointer px-3 py-2"
            >
              {item.icon && (
                <Icon name={item.icon} className="w-4 h-4 shrink-0" />
              )}
              {item.url ? (
                <Link href={item.url as any} target={item.target} className="flex-1">
                  {item.title}
                </Link>
              ) : (
                <button onClick={item.onClick} className="flex-1 text-left">
                  {item.title}
                </button>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
