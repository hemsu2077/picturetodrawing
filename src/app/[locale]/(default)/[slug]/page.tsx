export const dynamic = "force-static";
export const revalidate = 3600;

import { notFound } from "next/navigation";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import TransformationExamples from "@/components/blocks/transformation-examples";
import UseCases from "@/components/blocks/use-cases";
import DrawingGenerator from "@/components/drawing-generator";
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
  const { metaDefaults } = getPhotoTransformationConfig(slug as PhotoTransformationSlug);

  const normalizedBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, "")
    : undefined;
  const localizedPath =
    locale && locale !== "en" ? `/${locale}/${slug}` : `/${slug}`;
  const canonicalUrl = normalizedBaseUrl
    ? `${normalizedBaseUrl}${localizedPath}`
    : localizedPath;

  return {
    title: page.meta?.title || metaDefaults.title,
    description: page.meta?.description || metaDefaults.description,
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
  const { generator, heroBackgroundVariant } = getPhotoTransformationConfig(typedSlug);

  return (
    <>
      {page.hero && <Hero hero={page.hero} backgroundVariant={heroBackgroundVariant} />}
      <div id="drawing-generator">
        <DrawingGenerator
          defaultStyle={generator.defaultStyle}
          defaultModel={generator.defaultModel}
        />
      </div>
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
