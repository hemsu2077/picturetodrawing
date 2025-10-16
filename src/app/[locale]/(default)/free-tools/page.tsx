export const dynamic = "force-static";
export const revalidate = 3600;

import { Metadata } from "next";
import { getPage } from "@/services/page";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/icon";
import { Breadcrumb } from "@/components/drawing-styles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page: any = await getPage("free-tools", locale);

  const normalizedBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, "")
    : undefined;
  const localizedPath = locale && locale !== "en" ? `/${locale}/free-tools` : "/free-tools";
  const canonicalUrl = normalizedBaseUrl ? `${normalizedBaseUrl}${localizedPath}` : localizedPath;

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    alternates: {
      canonical: canonicalUrl || undefined,
    },
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
    <div className="container pt-4 space-y-8">
      {/* Structured Data */}
      {page.structured_data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: page.structured_data.name,
              description: page.structured_data.description,
              url: `${(process.env.NEXT_PUBLIC_WEB_URL || '').replace(/\/+$/, '')}${locale && locale !== 'en' ? `/${locale}` : ''}/free-tools`,
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
                ],
              },
            }),
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      {page.breadcrumb && (
        <Breadcrumb
          items={[{ label: page.breadcrumb.free_tools || 'Free Tools' }]}
          homeLabel={page.breadcrumb.home}
          hideOnMobile
        />
      )}

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
