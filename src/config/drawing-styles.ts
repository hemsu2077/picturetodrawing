export interface StyleOption {
  id: string;
  name: string;
  image: string;
}

// Popular styles configuration for different pages/contexts
export const POPULAR_STYLES_CONFIG = {
  default: ['pencil-sketch', 'line-drawing', 'watercolor-painting', 'inkart', 'superhero-comic']
};

export const getAllDrawingStyles = (t: any): StyleOption[] => [
  {
    id: 'pencil-sketch',
    name: t('drawing_generator.styles.pencil_sketch'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/pencil-sketch.webp'
  },
  {
    id: 'line-drawing',
    name: t('drawing_generator.styles.line_drawing'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/line-drawing.webp'
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
    id: 'inkart',
    name: t('drawing_generator.styles.inkart'),
    image: 'https://pub-66460257279749d4984c90d98154f46d.r2.dev/styles/inkart.webp'
  }
];

export const getPopularStyles = (t: any, configKey: keyof typeof POPULAR_STYLES_CONFIG = 'default'): StyleOption[] => {
  const allStyles = getAllDrawingStyles(t);
  const popularIds = POPULAR_STYLES_CONFIG[configKey];
  
  return popularIds
    .map(id => allStyles.find(style => style.id === id))
    .filter((style): style is StyleOption => style !== undefined);
};