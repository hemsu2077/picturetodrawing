export const dynamic = "force-static";
export const revalidate = 3600;

import { notFound } from "next/navigation";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature1 from "@/components/blocks/feature1";
import Feature from "@/components/blocks/feature";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import TransformationExamples from "@/components/blocks/transformation-examples";
import UseCases from "@/components/blocks/use-cases";
import DrawingGenerator from "@/components/drawing-generator";
import { Breadcrumb } from "@/components/drawing-styles";
import { 
  getPhotoTransformationConfig, 
  photoTransformationSlugs,
  PhotoTransformationSlug 
} from "@/config/photo-transformations";
import { getPhotoTransformationPage } from "@/services/page";

// Generate static params for all known transformation slugs
export async function generateStaticParams() {
  return photoTransformationSlugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  // Validate slug at metadata generation time
  if (!photoTransformationSlugs.includes(slug as PhotoTransformationSlug)) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const page = await getPhotoTransformationPage(slug as PhotoTransformationSlug, locale);

  const normalizedBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, "")
    : undefined;
  const localizedPath =
    locale && locale !== "en" ? `/${locale}/${slug}` : `/${slug}`;
  const canonicalUrl = normalizedBaseUrl
    ? `${normalizedBaseUrl}${localizedPath}`
    : localizedPath;

  return {
    title: page.meta?.title,
    description: page.meta?.description,
    alternates: {
      canonical: canonicalUrl || undefined,
    },
  };
}

export default async function PhotoTransformationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Runtime validation - return 404 for invalid slugs
  if (!photoTransformationSlugs.includes(slug as PhotoTransformationSlug)) {
    notFound();
  }

  const typedSlug = slug as PhotoTransformationSlug;
  const page = await getPhotoTransformationPage(typedSlug, locale);
  const { generator} = getPhotoTransformationConfig(typedSlug);

  // Structured data for SEO
  const normalizedBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, '')
    : '';
  const localizedPath = locale && locale !== 'en' ? `/${locale}/${slug}` : `/${slug}`;
  
  const structuredData = page.structured_data ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.structured_data.name,
    description: page.structured_data.description,
    url: `${normalizedBaseUrl}${localizedPath}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.structured_data.breadcrumb_home,
          item: normalizedBaseUrl || process.env.NEXT_PUBLIC_WEB_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.structured_data.breadcrumb_drawing_styles,
          item: `${normalizedBaseUrl}/drawing-styles`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.structured_data.breadcrumb_current,
          item: `${normalizedBaseUrl}${localizedPath}`
        }
      ]
    }
  } : null;

  return (
    <>
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      {page.breadcrumb && (
        <section className="pt-2">
          <div className="container">
            <Breadcrumb 
              items={[
                { label: page.breadcrumb.drawing_styles || 'Drawing Styles', href: '/drawing-styles' },
                { label: page.breadcrumb.current || slug }
              ]} 
              homeLabel={page.breadcrumb.home}
            />
          </div>
        </section>
      )}
      {page.hero && <Hero hero={page.hero} />}
      <div id="drawing-generator">
        <DrawingGenerator
          defaultStyle={generator.defaultStyle}
          defaultCategory={generator.defaultCategory}
        />
      </div>
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.transformation_examples && (
        <TransformationExamples section={page.transformation_examples} />
      )}
      {page.use_cases && <UseCases section={page.use_cases} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
