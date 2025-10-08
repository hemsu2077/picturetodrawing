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
    image: 'https://files.picturetodrawing.com/styles/pencil-sketch.webp?v=1.1'
  },
  {
    id: 'pencil-sketch-2',
    name: t('drawing_generator.styles.pencil_sketch_2'),
    image: 'https://files.picturetodrawing.com/styles/pencil-sketch-2.webp'
  },
  {
    id: 'line-drawing',
    name: t('drawing_generator.styles.line_drawing'),
    image: 'https://files.picturetodrawing.com/styles/line-drawing.webp?v=2'
  },
  {
    id: 'line-drawing-2',
    name: t('drawing_generator.styles.line_drawing_2'),
    image: 'https://files.picturetodrawing.com/styles/line-drawing-2.webp'
  },
  {
    id: 'line-art',
    name: t('drawing_generator.styles.line_art'),
    image: 'https://files.picturetodrawing.com/styles/line-art.webp'
  },
  {
    id: 'bold-outline',
    name: t('drawing_generator.styles.bold_outline'),
    image: 'https://files.picturetodrawing.com/styles/bold-outline.webp'
  },
  {
    id: 'charcoal-drawing',
    name: t('drawing_generator.styles.charcoal_drawing'),
    image: 'https://files.picturetodrawing.com/styles/charcoal-drawing.webp'
  },
  {
    id: 'inkart',
    name: t('drawing_generator.styles.inkart'),
    image: 'https://files.picturetodrawing.com/styles/inkart.webp'
  },
  {
    id: 'simple-drawing',
    name: t('drawing_generator.styles.simple_drawing'),
    image: 'https://files.picturetodrawing.com/styles/simple-drawing.webp'
  },
  {
    id: 'color-pencil-drawing',
    name: t('drawing_generator.styles.color_pencil_drawing'),
    image: 'https://files.picturetodrawing.com/styles/color-pencil-drawing.webp'
  },
  {
    id: 'watercolor-painting',
    name: t('drawing_generator.styles.watercolor_painting'),
    image: 'https://files.picturetodrawing.com/styles/water-color.webp'
  },
  {
    id: 'splash-watercolor-art',
    name: t('drawing_generator.styles.splash_watercolor_art'),
    image: 'https://files.picturetodrawing.com/styles/splash-watercolor.webp?v=2'
  },
  {
    id: 'kawaii-pastel-doodle',
    name: t('drawing_generator.styles.kawaii_pastel_doodle'),
    image: 'https://files.picturetodrawing.com/styles/kawaii-pastel-doodle.webp'
  },
  {
    id: 'van-gogh',
    name: t('drawing_generator.styles.van_gogh'),
    image: 'https://files.picturetodrawing.com/styles/van-gogh.webp'
  },
  {
    id: 'oil-painting',
    name: t('drawing_generator.styles.oil_painting'),
    image: 'https://files.picturetodrawing.com/styles/oil-painting.webp'
  },
  {
    id: 'pop-art',
    name: t('drawing_generator.styles.pop_art'),
    image: 'https://files.picturetodrawing.com/styles/pop-art.webp'
  },
  {
    id: 'psychedelic-art',
    name: t('drawing_generator.styles.psychedelic_art'),
    image: 'https://files.picturetodrawing.com/styles/psychedelic-art.webp'
  },
  {
    id: 'graffiti-street-art',
    name: t('drawing_generator.styles.graffiti_street_art'),
    image: 'https://files.picturetodrawing.com/styles/graffiti-street-art.webp'
  },
  {
    id: 'pure-cartoon',
    name: t('drawing_generator.styles.pure_cartoon'),
    image: 'https://files.picturetodrawing.com/styles/pure-cartoon.webp'
  },
  {
    id: 'ghibli-style',
    name: t('drawing_generator.styles.studio_ghibli'),
    image: 'https://files.picturetodrawing.com/styles/ghibli-style.webp'
  },
  {
    id: '90s-retro-anime',
    name: t('drawing_generator.styles.90s_retro_anime'),
    image: 'https://files.picturetodrawing.com/styles/90s-retro-anime.webp'
  },
  {
    id: 'shounen-anime',
    name: t('drawing_generator.styles.shounen_anime'),
    image: 'https://files.picturetodrawing.com/styles/shounen-anime.webp'
  },
  {
    id: 'shoujo-anime',
    name: t('drawing_generator.styles.shoujo_anime'),
    image: 'https://files.picturetodrawing.com/styles/shoujo-anime.webp'
  },
  {
    id: 'pixar-3d',
    name: t('drawing_generator.styles.pixar_3d'),
    image: 'https://files.picturetodrawing.com/styles/pixar-3d.webp'
  },
  {
    id: 'disney-3d',
    name: t('drawing_generator.styles.disney_3d'),
    image: 'https://files.picturetodrawing.com/styles/disney-3d.webp'
  },
  {
    id: '3d-chibi',
    name: t('drawing_generator.styles.3d_chibi'),
    image: 'https://files.picturetodrawing.com/styles/3d-chibi.webp'
  },
  {
    id: 'simpsons',
    name: t('drawing_generator.styles.simpsons'),
    image: 'https://files.picturetodrawing.com/styles/simpsons.webp'
  },
  {
    id: 'superhero-comic',
    name: t('drawing_generator.styles.superhero_comic'),
    image: 'https://files.picturetodrawing.com/styles/superhero-comic.webp?v=2'
  },
  {
    id: 'manga',
    name: t('drawing_generator.styles.manga'),
    image: 'https://files.picturetodrawing.com/styles/manga.webp'
  },
  {
    id: 'cyberpunk-neon',
    name: t('drawing_generator.styles.cyberpunk_neon'),
    image: 'https://files.picturetodrawing.com/styles/cyberpunk-neon.webp'
  },
  {
    id: 'gta-style',
    name: t('drawing_generator.styles.gta_style'),
    image: 'https://files.picturetodrawing.com/styles/gta-style.webp'
  },
  {
    id: 'south-park',
    name: t('drawing_generator.styles.south_park'),
    image: 'https://files.picturetodrawing.com/styles/south-park.webp'
  },
  {
    id: 'rick-morty',
    name: t('drawing_generator.styles.rick_morty'),
    image: 'https://files.picturetodrawing.com/styles/rick-morty.webp'
  },
  {
    id: 'snoopy',
    name: t('drawing_generator.styles.snoopy'),
    image: 'https://files.picturetodrawing.com/styles/snoopy.webp'
  },
  {
    id: 'pixel-art',
    name: t('drawing_generator.styles.pixel_art'),
    image: 'https://files.picturetodrawing.com/styles/pixel-art.webp'
  },
  {
    id: 'clay',
    name: t('drawing_generator.styles.clay'),
    image: 'https://files.picturetodrawing.com/styles/clay.webp'
  },
  {
    id: 'low-poly',
    name: t('drawing_generator.styles.low_poly'),
    image: 'https://files.picturetodrawing.com/styles/low-poly.webp'
  },

];

export const getPopularStyles = (t: any, configKey: PopularStylesConfigKey = 'default'): StyleOption[] => {
  const allStyles = getAllDrawingStyles(t);
  const popularIds = POPULAR_STYLES_CONFIG[configKey] ?? POPULAR_STYLES_CONFIG.default;
  
  return popularIds
    .map(id => allStyles.find(style => style.id === id))
    .filter((style): style is StyleOption => style !== undefined);
};
