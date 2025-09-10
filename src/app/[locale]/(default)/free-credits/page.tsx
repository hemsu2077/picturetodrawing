import DailyCheckin from "@/components/checkin/daily-checkin";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getFreeCreditsPage } from "@/services/page";
import { useLocale } from "next-intl";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const page = await getFreeCreditsPage(locale);
  return {
    title: page.meta.title,
    description: page.meta.description,
    robots: page.meta.robots,
  };
}

export default async function FreeCredits({ params: { locale } }: { params: { locale: string } }) {
  // Check authentication if enabled
  if (isAuthEnabled()) {
    const session = await auth();
    if (!session?.user?.uuid) {
      redirect("/auth/signin?callbackUrl=/free-credits");
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