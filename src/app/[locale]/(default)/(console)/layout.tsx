import ConsoleLayout from "@/components/console/layout";
import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ({ children }: { children: ReactNode }) {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  const t = await getTranslations();

  const sidebar: Sidebar = {
    nav: {
      items: [
        {
          title: t("my_account.title"),
          url: "/my-account",
          icon: "RiUserLine",
          is_active: false,
        },
        {
          title: "My Drawings",
          url: "/my-drawings",
          icon: "RiImageLine",
          is_active: false,
        },
        {
          title: t("user.my_orders"),
          url: "/my-orders",
          icon: "RiShoppingBagLine",
          is_active: false,
        },
        {
          title: t("my_credits.title"),
          url: "/my-credits",
          icon: "RiCoinsLine",
          is_active: false,
        },
        {
          title: "My Invites",
          url: "/my-invites",
          icon: "RiGiftLine",
          is_active: false,
        },
      ],
    },
  };

  return <ConsoleLayout sidebar={sidebar}>{children}</ConsoleLayout>;
}
