import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllDrawingStyles } from '@/config/drawing-styles';
import { STYLE_CATEGORIES } from '@/config/style-categories';
import { CategorySection, CategoryNav, Breadcrumb } from '@/components/drawing-styles';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Sparkles } from 'lucide-react';
import { getDrawingStylesPage } from '@/services/page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getDrawingStylesPage(locale);
  
  const normalizedBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
    ? process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, '')
    : undefined;
  const localizedPath =
    locale && locale !== 'en' ? `/${locale}/drawing-styles` : '/drawing-styles';
  const canonicalUrl = normalizedBaseUrl
    ? `${normalizedBaseUrl}${localizedPath}`
    : localizedPath;

  return {
    title: page.meta?.title,
    description: page.meta?.description,
    openGraph: {
      title: page.meta?.title,
      description: page.meta?.description,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl || undefined,
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function DrawingStylesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'drawing_generator' });
  const page = await getDrawingStylesPage(locale);

  const allStyles = getAllDrawingStyles(t);
  const totalStylesCount = allStyles.length;

  // Organize styles by category with i18n
  const categorizedStyles = STYLE_CATEGORIES.map((category) => ({
    ...category,
    name: page.categories?.[category.id]?.name || '',
    description: page.categories?.[category.id]?.description || '',
    styles: category.styles
      .map((styleId) => allStyles.find((s) => s.id === styleId))
      .filter((style): style is NonNullable<typeof style> => style !== undefined)
  }));

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.structured_data?.name,
    description: page.structured_data?.description,
    url: `${process.env.NEXT_PUBLIC_WEB_URL}/drawing-styles`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.structured_data?.breadcrumb_home,
          item: process.env.NEXT_PUBLIC_WEB_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.structured_data?.breadcrumb_drawing_styles,
          item: `${process.env.NEXT_PUBLIC_WEB_URL}/drawing-styles`
        }
      ]
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="py-8 lg:py-12 bg-muted/50">
        <div className="container">
          <Breadcrumb 
            items={[{ label: page.breadcrumb?.drawing_styles || 'Drawing Styles' }]} 
            homeLabel={page.breadcrumb?.home}
            hideOnMobile
          />
          
          <div className="max-w-3xl space-y-6 mt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="size-4" />
              {totalStylesCount}+ {page.hero?.badge}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {page.hero?.title}
            </h1>
            
            <p className="text-md md:text-xl text-muted-foreground leading-relaxed">
              {page.hero?.description}
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNav categories={categorizedStyles} />

      {/* Category Sections */}
      <div className="container py-6 md:py-12 space-y-12 md:space-y-20">
        {categorizedStyles.map((category) => (
          <CategorySection
            key={category.id}
            id={category.id}
            name={category.name}
            description={category.description}
            styles={category.styles}
            styleMetadata={page.style_metadata || {}}
            styleCardLabels={page.style_card}
          />
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {page.cta?.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {page.cta?.description}
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/#drawing-generator">
                {page.cta?.button}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
