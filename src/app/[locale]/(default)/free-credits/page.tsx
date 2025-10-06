import DailyCheckin from "@/components/checkin/daily-checkin";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { Metadata } from "next";
import { getFreeCreditsPage } from "@/services/page";
import LoginRequiredLanding from "@/components/auth/login-required-landing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getFreeCreditsPage(locale);
  
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/free-credits`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/free-credits`;
  }

  return {
    title: page.meta.title,
    description: page.meta.description,
    robots: page.meta.robots,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function FreeCredits({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Check authentication if enabled
  if (isAuthEnabled()) {
    const session = await auth();
    if (!session?.user?.uuid) {
      return (
        <LoginRequiredLanding 
          titleKey="login_required.free_credits_title"
          descriptionKey="login_required.free_credits_description"
        />
      );
    }
  }

  const page = await getFreeCreditsPage(locale);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{page.hero.title}</h1>
          <p className="text-muted-foreground text-lg">
            {page.hero.description}
          </p>
        </div>
        
        <DailyCheckin />
      </div>
    </div>
  );
}