export const dynamic = "force-static";
export const revalidate = 3600;

import { Metadata } from "next";
import { getPage } from "@/services/page";
import { FreeLineArtTool } from "@/components/free-tools/line-art";
import FreeToolHero from "@/components/blocks/free-tool-hero";
import { UpgradeCard } from "@/components/free-tools/upgrade-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page: any = await getPage("free-tools/photo-to-sketch", locale);
  const base = process.env.NEXT_PUBLIC_WEB_URL?.replace(/\/+$/, "") || "";
  const path = locale && locale !== "en" ? `/${locale}/free-tools/photo-to-sketch` : "/free-tools/photo-to-sketch";
  return {
    title: page?.meta?.title || "Photo to Sketch (Free)",
    description: page?.meta?.description || "Browser-based line drawing converter.",
    alternates: { canonical: `${base}${path}` },
  };
}

export default async function FreeToolPhotoToSketchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page: any = await getPage("free-tools/photo-to-sketch", locale);

  return (
    <>
      {page.hero && <FreeToolHero hero={page.hero} />}
      <div className="container space-y-8 pb-16">
        <FreeLineArtTool />
        
        {page.upgrade_card && (
          <UpgradeCard
            title={page.upgrade_card.title}
            description={page.upgrade_card.description}
            features={page.upgrade_card.features}
            ctaText={page.upgrade_card.cta_text}
            ctaLink={page.upgrade_card.cta_link}
            styleImage={page.upgrade_card.image}
          />
        )}
      </div>
    </>
  );
}

