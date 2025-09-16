export const dynamic = "force-static";
export const revalidate = 3600;

import Pricing from "@/components/blocks/pricing";
import { getPricingPage } from "@/services/page";
import FAQ from "@/components/blocks/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPricingPage(locale);
  
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/pricing`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/pricing`;
  }

  return {
    title: page.meta?.title || "Pricing - AI Photo to Drawing Converter",
    description: page.meta?.description || "Choose your perfect plan for transforming photos into stunning artwork. Flexible options for hobbyists to professionals with our AI-powered drawing converter.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPricingPage(locale);

  return (
    <>
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.faq && <FAQ section={page.faq} />}
    </>
  );
}
