import { Metadata } from 'next';
import { getAllDrawingStyles } from '@/config/drawing-styles';
import { STYLE_CATEGORIES, STYLE_METADATA } from '@/config/style-categories';
import { CategorySection, CategoryNav, Breadcrumb } from '@/components/drawing-styles';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Drawing Styles for Photos | 38+ Styles | Picture to Drawing',
  description: 'Explore 38+ drawing styles for your photos. From line drawings to watercolor art, anime to 3D cartoon styles. Find the perfect style for your image transformation.',
  openGraph: {
    title: 'Drawing Styles for Photos | Picture to Drawing',
    description: 'Discover 38+ unique drawing styles to transform your photos. Line art, watercolor, anime, cartoon, and more.',
    type: 'website',
  },
  alternates: {
    canonical: '/drawing-styles'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function DrawingStylesPage() {
  // For now, use a simple translation function (will be replaced with i18n later)
  const t = (key: string) => {
    // Simple mapping for now
    const translations: Record<string, string> = {
      'drawing_generator.styles.pencil_sketch': 'Pencil Sketch',
      'drawing_generator.styles.pencil_sketch_2': 'Pencil Sketch 2',
      'drawing_generator.styles.line_drawing': 'Line Drawing',
      'drawing_generator.styles.line_drawing_2': 'Line Drawing 2',
      'drawing_generator.styles.line_art': 'Line Art',
      'drawing_generator.styles.bold_outline': 'Bold Outline',
      'drawing_generator.styles.charcoal_drawing': 'Charcoal Drawing',
      'drawing_generator.styles.inkart': 'Ink Art',
      'drawing_generator.styles.simple_drawing': 'Simple Drawing',
      'drawing_generator.styles.color_pencil_drawing': 'Color Pencil Drawing',
      'drawing_generator.styles.watercolor_painting': 'Watercolor Painting',
      'drawing_generator.styles.splash_watercolor_art': 'Splash Watercolor Art',
      'drawing_generator.styles.kawaii_pastel_doodle': 'Kawaii Pastel Doodle',
      'drawing_generator.styles.van_gogh': 'Van Gogh Style',
      'drawing_generator.styles.oil_painting': 'Oil Painting',
      'drawing_generator.styles.pop_art': 'Pop Art',
      'drawing_generator.styles.psychedelic_art': 'Psychedelic Art',
      'drawing_generator.styles.graffiti_street_art': 'Graffiti Street Art',
      'drawing_generator.styles.pure_cartoon': 'Pure Cartoon',
      'drawing_generator.styles.studio_ghibli': 'Studio Ghibli',
      'drawing_generator.styles.90s_retro_anime': '90s Retro Anime',
      'drawing_generator.styles.shounen_anime': 'Shounen Anime',
      'drawing_generator.styles.shoujo_anime': 'Shoujo Anime',
      'drawing_generator.styles.pixar_3d': 'Pixar 3D',
      'drawing_generator.styles.disney_3d': 'Disney 3D',
      'drawing_generator.styles.3d_chibi': '3D Chibi',
      'drawing_generator.styles.simpsons': 'Simpsons',
      'drawing_generator.styles.superhero_comic': 'Superhero Comic',
      'drawing_generator.styles.manga': 'Manga',
      'drawing_generator.styles.cyberpunk_neon': 'Cyberpunk Neon',
      'drawing_generator.styles.gta_style': 'GTA Style',
      'drawing_generator.styles.south_park': 'South Park',
      'drawing_generator.styles.rick_morty': 'Rick & Morty',
      'drawing_generator.styles.snoopy': 'Snoopy',
      'drawing_generator.styles.pixel_art': 'Pixel Art',
      'drawing_generator.styles.clay': 'Clay Style',
      'drawing_generator.styles.low_poly': 'Low Poly',
    };
    return translations[key] || key;
  };

  const allStyles = getAllDrawingStyles(t);

  // Organize styles by category
  const categorizedStyles = STYLE_CATEGORIES.map((category) => ({
    ...category,
    styles: category.styles
      .map((styleId) => allStyles.find((s) => s.id === styleId))
      .filter((style): style is NonNullable<typeof style> => style !== undefined)
  }));

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Drawing Styles for Photos',
    description: 'Explore 38+ drawing styles for your photos. From line drawings to watercolor art, anime to 3D cartoon styles.',
    url: `${process.env.NEXT_PUBLIC_WEB_URL}/drawing-styles`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_WEB_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Drawing Styles',
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
      <section className="py-12 lg:py-16 border-b">
        <div className="container">
          <Breadcrumb items={[{ label: 'Drawing Styles' }]} />
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="size-4" />
              38+ Unique Styles
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Drawing Styles for Photos
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform your photos with our collection of 38+ professional drawing styles. 
              From classic line drawings to modern anime art, find the perfect style to bring 
              your creative vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNav categories={STYLE_CATEGORIES} />

      {/* Category Sections */}
      <div className="container py-12 space-y-20">
        {categorizedStyles.map((category) => (
          <CategorySection
            key={category.id}
            id={category.id}
            name={category.name}
            description={category.description}
            styles={category.styles}
            styleMetadata={STYLE_METADATA}
          />
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Photos?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start creating stunning artwork with our AI-powered drawing generator. 
              Try any style for free today.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/#drawing-generator">
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
