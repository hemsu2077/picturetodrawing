import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import Showcase1 from "@/components/blocks/showcase1";
import UseCases from "@/components/blocks/use-cases";
import { getPhotoToLineDrawingPage } from "@/services/page";
import DrawingGenerator from "@/components/drawing-generator";
import TransformationExamples from "@/components/blocks/transformation-examples";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPhotoToLineDrawingPage(locale);
  
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/photo-to-line-drawing`;
  }

  return {
    title: page.meta?.title || "Photo to Line Drawing Converter - AI-Powered Image to Line Art Tool",
    description: page.meta?.description || "Convert photos to professional line drawings instantly with our AI-powered tool. Perfect for crafts, tattoos, embroidery patterns, and digital art. Free to try, secure processing.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PhotoToLineDrawingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPhotoToLineDrawingPage(locale);

  return (
    <>
      {page.hero && <Hero hero={page.hero} backgroundVariant="line-drawing" />}
      <div id="drawing-generator">
        <DrawingGenerator defaultStyle="line-drawing" />
      </div>
      {page.transformation_examples && <TransformationExamples section={page.transformation_examples} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
