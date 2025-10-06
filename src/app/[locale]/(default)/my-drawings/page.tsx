import { auth } from "@/auth";
import { getImagesByUserUuid } from "@/models/image";
import MyDrawingsClient from "./client";
import { Metadata } from "next";
import LoginRequiredLanding from "@/components/auth/login-required-landing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/my-drawings`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/my-drawings`;
  }

  return {
    title: t("my_drawings.meta_title"),
    description: t("my_drawings.meta_description"),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function MyDrawingsPage() {
  const session = await auth();
  
  if (!session?.user?.uuid) {
    return (
      <LoginRequiredLanding 
        titleKey="login_required.my_drawings_title"
        descriptionKey="login_required.my_drawings_description"
      />
    );
  }

  // Get user's drawings
  const drawings = await getImagesByUserUuid(session.user.uuid, 1, 100);

  return <MyDrawingsClient drawings={drawings || []} />;
}
