import Pricing from "@/components/blocks/pricing";
import { getPricingPage } from "@/services/page";
import FAQ from "@/components/blocks/faq";

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
