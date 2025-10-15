export const dynamic = "force-static";
export const revalidate = 3600;

import { Metadata } from "next";
import { getPage } from "@/services/page";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page: any = await getPage("free-tools", locale);
  const base = process.env.NEXT_PUBLIC_WEB_URL?.replace(/\/+$/, "") || "";
  const path = locale && locale !== "en" ? `/${locale}/free-tools` : "/free-tools";
  return {
    title: page?.meta?.title || "Free Tools",
    description: page?.meta?.description || "Try our browser-based free tools.",
    alternates: { canonical: `${base}${path}` },
  };
}

export default async function FreeToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page: any = await getPage("free-tools", locale);

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">{page?.hero?.title || "Free Tools"}</h1>
        <p className="text-muted-foreground text-lg">
          {page?.hero?.description || "Browser-based utilities. No upload required."}
        </p>
      </div>

      {/* Tools list */}
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(page?.tools || []).map((tool: any, idx: number) => (
            <Link
              key={idx}
              href={tool.url as any}
              className="group border rounded-lg overflow-hidden hover:shadow-sm transition-shadow bg-card"
            >
              {tool.thumbnail && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={tool.thumbnail}
                    alt={tool.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  {tool.icon && <Icon name={tool.icon} className="size-4 text-primary" />}
                  <span>{tool.title}</span>
                </div>
                {tool.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
