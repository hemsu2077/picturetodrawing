export const dynamic = "force-static";
export const revalidate = 3600;

import { Metadata } from "next";
import { getPage } from "@/services/page";
import { FreeLineArtTool } from "@/components/free-tools/line-art";
import FreeToolHero from "@/components/blocks/free-tool-hero";
import { UpgradeCard } from "@/components/free-tools/upgrade-card";
import Showcase from "@/components/blocks/showcase";
import FAQ from "@/components/blocks/faq";
import { Breadcrumb } from "@/components/drawing-styles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page: any = await getPage("free-tools/photo-to-sketch", locale);

  const normalizedBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, "")
    : undefined;
  const localizedPath =
    locale && locale !== "en" ? `/${locale}/free-tools/photo-to-sketch` : "/free-tools/photo-to-sketch";
  const canonicalUrl = normalizedBaseUrl ? `${normalizedBaseUrl}${localizedPath}` : localizedPath;

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    alternates: {
      canonical: canonicalUrl || undefined,
    },
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
      {/* Structured Data */}
      {page.structured_data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: page.structured_data.name,
              description: page.structured_data.description,
              url: `${(process.env.NEXT_PUBLIC_WEB_URL || '').replace(/\/+$/, '')}${locale && locale !== 'en' ? `/${locale}` : ''}/free-tools/photo-to-sketch`,
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: page.structured_data.breadcrumb_home,
                    item: (process.env.NEXT_PUBLIC_WEB_URL || '').replace(/\/+$/, '') || undefined,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: page.structured_data.breadcrumb_free_tools,
                    item: `${(process.env.NEXT_PUBLIC_WEB_URL || '').replace(/\/+$/, '')}${locale && locale !== 'en' ? `/${locale}` : ''}/free-tools`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: page.structured_data.breadcrumb_current,
                    item: `${(process.env.NEXT_PUBLIC_WEB_URL || '').replace(/\/+$/, '')}${locale && locale !== 'en' ? `/${locale}` : ''}/free-tools/photo-to-sketch`,
                  },
                ],
              },
            }),
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      {page.breadcrumb && (
        <section className="pt-4">
          <div className="container">
            <Breadcrumb
              items={[
                { label: page.breadcrumb.free_tools || 'Free Tools', href: '/free-tools' },
                { label: page.breadcrumb.current || 'Photo to Sketch' },
              ]}
              homeLabel={page.breadcrumb.home}
            />
          </div>
        </section>
      )}

      {page.hero && <FreeToolHero hero={page.hero} />}

      <FreeLineArtTool />
      
      {page.showcase && <Showcase section={page.showcase} />}
      
    
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

    {page.faq && <FAQ section={page.faq} />}
    </>
  );
}
