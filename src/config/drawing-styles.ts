export interface StyleOption {
  id: string;
  name: string;
  image: string;
}

// Popular styles configuration for different pages/contexts
const DEFAULT_POPULAR_STYLES = [
  'pencil-sketch',
  'line-drawing',
  'watercolor-painting',
  'inkart',
  'superhero-comic'
] as const;

export const POPULAR_STYLES_CONFIG = {
  default: DEFAULT_POPULAR_STYLES,
  'photo-to-line-drawing': ['line-drawing', 'line-drawing-2', 'line-art', 'bold-outline', 'pencil-sketch'],
  'photo-to-cartoon': ['ghibli-style', 'pure-cartoon', 'simpsons', 'manga', '90s-retro-anime']
} as const;

export type PopularStylesConfigKey = keyof typeof POPULAR_STYLES_CONFIG;

export const getAllDrawingStyles = (t: any): StyleOption[] => [
  {
    id: 'pencil-sketch',
    name: t('drawing_generator.styles.pencil_sketch'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pencil-sketch.webp?v=1.1'
  },
  {
    id: 'pencil-sketch-2',
    name: t('drawing_generator.styles.pencil_sketch_2'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pencil-sketch-2.webp'
  },
  {
    id: 'line-drawing',
    name: t('drawing_generator.styles.line_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-drawing.webp?v=2'
  },
  {
    id: 'line-drawing-2',
    name: t('drawing_generator.styles.line_drawing_2'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-drawing-2.webp'
  },
  {
    id: 'line-art',
    name: t('drawing_generator.styles.line_art'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-art.webp'
  },
  {
    id: 'bold-outline',
    name: t('drawing_generator.styles.bold_outline'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/bold-outline.webp'
  },
  {
    id: 'charcoal-drawing',
    name: t('drawing_generator.styles.charcoal_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/charcoal-drawing.webp'
  },
  {
    id: 'inkart',
    name: t('drawing_generator.styles.inkart'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/inkart.webp'
  },
  {
    id: 'color-pencil-drawing',
    name: t('drawing_generator.styles.color_pencil_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/color-pencil-drawing.webp'
  },
  {
    id: 'watercolor-painting',
    name: t('drawing_generator.styles.watercolor_painting'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/water-color.webp'
  },
  {
    id: 'splash-watercolor-art',
    name: t('drawing_generator.styles.splash_watercolor_art'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/splash-watercolor.webp?v=2'
  },
  {
    id: 'kawaii-pastel-doodle',
    name: t('drawing_generator.styles.kawaii_pastel_doodle'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/kawaii-pastel-doodle.webp'
  },
  {
    id: 'van-gogh',
    name: t('drawing_generator.styles.van_gogh'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/van-gogh.webp'
  },
  {
    id: 'oil-painting',
    name: t('drawing_generator.styles.oil_painting'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/oil-painting.webp'
  },
  {
    id: 'pop-art',
    name: t('drawing_generator.styles.pop_art'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pop-art.webp'
  },
  {
    id: 'psychedelic-art',
    name: t('drawing_generator.styles.psychedelic_art'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/psychedelic-art.webp'
  },
  {
    id: 'graffiti-street-art',
    name: t('drawing_generator.styles.graffiti_street_art'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/graffiti-street-art.webp'
  },
  {
    id: 'pure-cartoon',
    name: t('drawing_generator.styles.pure_cartoon'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pure-cartoon.webp'
  },
  {
    id: 'ghibli-style',
    name: t('drawing_generator.styles.studio_ghibli'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/ghibli-style.webp'
  },
  {
    id: '90s-retro-anime',
    name: t('drawing_generator.styles.90s_retro_anime'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/90s-retro-anime.webp'
  },
  {
    id: 'shounen-anime',
    name: t('drawing_generator.styles.shounen_anime'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/shounen-anime.webp'
  },
  {
    id: 'shoujo-anime',
    name: t('drawing_generator.styles.shoujo_anime'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/shoujo-anime.webp'
  },
  {
    id: 'pixar-3d',
    name: t('drawing_generator.styles.pixar_3d'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pixar-3d.webp'
  },
  {
    id: 'disney-3d',
    name: t('drawing_generator.styles.disney_3d'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/disney-3d.webp'
  },
  {
    id: '3d-chibi',
    name: t('drawing_generator.styles.3d_chibi'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/3d-chibi.webp'
  },
  {
    id: 'simpsons',
    name: t('drawing_generator.styles.simpsons'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/simpsons.webp'
  },
  {
    id: 'superhero-comic',
    name: t('drawing_generator.styles.superhero_comic'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/superhero-comic.webp?v=2'
  },
  {
    id: 'manga',
    name: t('drawing_generator.styles.manga'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/manga.webp'
  },
  {
    id: 'cyberpunk-neon',
    name: t('drawing_generator.styles.cyberpunk_neon'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/cyberpunk-neon.webp'
  },
  {
    id: 'gta-style',
    name: t('drawing_generator.styles.gta_style'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/gta-style.webp'
  },
  {
    id: 'south-park',
    name: t('drawing_generator.styles.south_park'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/south-park.webp'
  },
  {
    id: 'rick-morty',
    name: t('drawing_generator.styles.rick_morty'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/rick-morty.webp'
  },
  {
    id: 'snoopy',
    name: t('drawing_generator.styles.snoopy'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/snoopy.webp'
  },
  {
    id: 'pixel-art',
    name: t('drawing_generator.styles.pixel_art'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pixel-art.webp'
  },
  {
    id: 'clay',
    name: t('drawing_generator.styles.clay'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/clay.webp'
  },
  {
    id: 'low-poly',
    name: t('drawing_generator.styles.low_poly'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/low-poly.webp'
  },

];

export const getPopularStyles = (t: any, configKey: PopularStylesConfigKey = 'default'): StyleOption[] => {
  const allStyles = getAllDrawingStyles(t);
  const popularIds = POPULAR_STYLES_CONFIG[configKey] ?? POPULAR_STYLES_CONFIG.default;
  
  return popularIds
    .map(id => allStyles.find(style => style.id === id))
    .filter((style): style is StyleOption => style !== undefined);
};
