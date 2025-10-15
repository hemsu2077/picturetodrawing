export const dynamic = "force-static";
export const revalidate = 3600;

import { Metadata } from "next";
import { getPage } from "@/services/page";
import { FreeLineArtTool } from "@/components/free-tools/line-art";
import FreeToolHero from "@/components/blocks/free-tool-hero";

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
      <div className="container py-8">
        <FreeLineArtTool />
      </div>
    </>
  );
}

