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
  'photo-to-line-drawing': DEFAULT_POPULAR_STYLES,
  'photo-to-cartoon': ['ghibli-style', 'pixar-3d', 'simpsons', 'pixel-art', 'clay']
} as const;

export type PopularStylesConfigKey = keyof typeof POPULAR_STYLES_CONFIG;

export const getAllDrawingStyles = (t: any): StyleOption[] => [
  {
    id: 'pencil-sketch',
    name: t('drawing_generator.styles.pencil_sketch'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pencil-sketch.webp'
  },
  {
    id: 'line-drawing',
    name: t('drawing_generator.styles.line_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-drawing.webp?v=2'
  },
  {
    id: 'charcoal-drawing',
    name: t('drawing_generator.styles.charcoal_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/charcoal-drawing.webp'
  },
  {
    id: 'watercolor-painting',
    name: t('drawing_generator.styles.watercolor_painting'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/watercolor-painting.webp'
  },
  {
    id: 'color-pencil-drawing',
    name: t('drawing_generator.styles.color_pencil_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/color-pencil-drawing.webp'
  },
  {
    id: 'inkart',
    name: t('drawing_generator.styles.inkart'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/inkart.webp'
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
    id: 'simpsons',
    name: t('drawing_generator.styles.simpsons'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/simpsons.webp'
  },
  {
    id: 'superhero-comic',
    name: t('drawing_generator.styles.superhero_comic'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/superhero-comic.webp'
  },
  {
    id: 'manga',
    name: t('drawing_generator.styles.manga'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/manga.webp'
  },
  {
    id: 'south-park',
    name: t('drawing_generator.styles.south_park'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/south-park.webp'
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

];

export const getPopularStyles = (t: any, configKey: PopularStylesConfigKey = 'default'): StyleOption[] => {
  const allStyles = getAllDrawingStyles(t);
  const popularIds = POPULAR_STYLES_CONFIG[configKey] ?? POPULAR_STYLES_CONFIG.default;
  
  return popularIds
    .map(id => allStyles.find(style => style.id === id))
    .filter((style): style is StyleOption => style !== undefined);
};
