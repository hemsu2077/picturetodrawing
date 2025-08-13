import AIExcellence from "@/components/blocks/ai-excellence";
import ArtStyles from "@/components/blocks/art-styles";
import Branding from "@/components/blocks/branding";
import Comparison from "@/components/blocks/comparison";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import PerfectUses from "@/components/blocks/perfect-uses";
import Pricing from "@/components/blocks/pricing";
import Showcase from "@/components/blocks/showcase";
import Stats from "@/components/blocks/stats";
import Testimonial from "@/components/blocks/testimonial";
import TransformationExamples from "@/components/blocks/transformation-examples";
import { getLandingPage } from "@/services/page";
import DrawingGenerator from "@/components/drawing-generator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);

  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      <div id="drawing-generator">
        <DrawingGenerator />
      </div>
      {page.transformation_examples && <TransformationExamples section={page.transformation_examples} />}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.perfect_uses && <PerfectUses section={page.perfect_uses} />}
      {page.comparison && <Comparison section={page.comparison} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
