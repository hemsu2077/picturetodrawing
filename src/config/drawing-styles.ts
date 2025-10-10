export interface StyleOption {
  id: string;
  name: string;
  image: string;
}

export const getAllDrawingStyles = (t: any): StyleOption[] => [
  {
    id: 'pencil-sketch',
    name: t('styles.pencil_sketch'),
    image: 'https://files.picturetodrawing.com/styles/pencil-sketch.webp?v=1.1'
  },
  {
    id: 'pencil-sketch-2',
    name: t('styles.pencil_sketch_2'),
    image: 'https://files.picturetodrawing.com/styles/pencil-sketch-2.webp'
  },
  {
    id: 'line-drawing',
    name: t('styles.line_drawing'),
    image: 'https://files.picturetodrawing.com/styles/line-drawing.webp?v=2'
  },
  {
    id: 'line-drawing-2',
    name: t('styles.line_drawing_2'),
    image: 'https://files.picturetodrawing.com/styles/line-drawing-2.webp'
  },
  {
    id: 'line-art',
    name: t('styles.line_art'),
    image: 'https://files.picturetodrawing.com/styles/line-art.webp'
  },
  {
    id: 'bold-outline',
    name: t('styles.bold_outline'),
    image: 'https://files.picturetodrawing.com/styles/bold-outline.webp'
  },
  {
    id: 'charcoal-drawing',
    name: t('styles.charcoal_drawing'),
    image: 'https://files.picturetodrawing.com/styles/charcoal-drawing.webp'
  },
  {
    id: 'inkart',
    name: t('styles.inkart'),
    image: 'https://files.picturetodrawing.com/styles/inkart.webp'
  },
  {
    id: 'simple-drawing',
    name: t('styles.simple_drawing'),
    image: 'https://files.picturetodrawing.com/styles/simple-drawing.webp'
  },
  {
    id: 'color-pencil-drawing',
    name: t('styles.color_pencil_drawing'),
    image: 'https://files.picturetodrawing.com/styles/color-pencil-drawing.webp'
  },
  {
    id: 'watercolor-painting',
    name: t('styles.watercolor_painting'),
    image: 'https://files.picturetodrawing.com/styles/water-color.webp'
  },
  {
    id: 'splash-watercolor-art',
    name: t('styles.splash_watercolor_art'),
    image: 'https://files.picturetodrawing.com/styles/splash-watercolor.webp?v=2'
  },
  {
    id: 'kawaii-pastel-doodle',
    name: t('styles.kawaii_pastel_doodle'),
    image: 'https://files.picturetodrawing.com/styles/kawaii-pastel-doodle.webp'
  },
  {
    id: 'van-gogh',
    name: t('styles.van_gogh'),
    image: 'https://files.picturetodrawing.com/styles/van-gogh.webp'
  },
  {
    id: 'oil-painting',
    name: t('styles.oil_painting'),
    image: 'https://files.picturetodrawing.com/styles/oil-painting.webp'
  },
  {
    id: 'pop-art',
    name: t('styles.pop_art'),
    image: 'https://files.picturetodrawing.com/styles/pop-art.webp'
  },
  {
    id: 'psychedelic-art',
    name: t('styles.psychedelic_art'),
    image: 'https://files.picturetodrawing.com/styles/psychedelic-art.webp'
  },
  {
    id: 'graffiti-street-art',
    name: t('styles.graffiti_street_art'),
    image: 'https://files.picturetodrawing.com/styles/graffiti-street-art.webp'
  },
  {
    id: 'pure-cartoon',
    name: t('styles.pure_cartoon'),
    image: 'https://files.picturetodrawing.com/styles/pure-cartoon.webp'
  },
  {
    id: 'ghibli-style',
    name: t('styles.studio_ghibli'),
    image: 'https://files.picturetodrawing.com/styles/ghibli-style.webp'
  },
  {
    id: '90s-retro-anime',
    name: t('styles.90s_retro_anime'),
    image: 'https://files.picturetodrawing.com/styles/90s-retro-anime.webp'
  },
  {
    id: 'shounen-anime',
    name: t('styles.shounen_anime'),
    image: 'https://files.picturetodrawing.com/styles/shounen-anime.webp'
  },
  {
    id: 'shoujo-anime',
    name: t('styles.shoujo_anime'),
    image: 'https://files.picturetodrawing.com/styles/shoujo-anime.webp'
  },
  {
    id: 'pixar-3d',
    name: t('styles.pixar_3d'),
    image: 'https://files.picturetodrawing.com/styles/pixar-3d.webp'
  },
  {
    id: 'disney-3d',
    name: t('styles.disney_3d'),
    image: 'https://files.picturetodrawing.com/styles/disney-3d.webp'
  },
  {
    id: '3d-chibi',
    name: t('styles.3d_chibi'),
    image: 'https://files.picturetodrawing.com/styles/3d-chibi.webp'
  },
  {
    id: 'simpsons',
    name: t('styles.simpsons'),
    image: 'https://files.picturetodrawing.com/styles/simpsons.webp'
  },
  {
    id: 'superhero-comic',
    name: t('styles.superhero_comic'),
    image: 'https://files.picturetodrawing.com/styles/superhero-comic.webp?v=2'
  },
  {
    id: 'manga',
    name: t('styles.manga'),
    image: 'https://files.picturetodrawing.com/styles/manga.webp'
  },
  {
    id: 'cyberpunk-neon',
    name: t('styles.cyberpunk_neon'),
    image: 'https://files.picturetodrawing.com/styles/cyberpunk-neon.webp'
  },
  {
    id: 'gta-style',
    name: t('styles.gta_style'),
    image: 'https://files.picturetodrawing.com/styles/gta-style.webp'
  },
  {
    id: 'south-park',
    name: t('styles.south_park'),
    image: 'https://files.picturetodrawing.com/styles/south-park.webp'
  },
  {
    id: 'rick-morty',
    name: t('styles.rick_morty'),
    image: 'https://files.picturetodrawing.com/styles/rick-morty.webp'
  },
  {
    id: 'snoopy',
    name: t('styles.snoopy'),
    image: 'https://files.picturetodrawing.com/styles/snoopy.webp'
  },
  {
    id: 'pixel-art',
    name: t('styles.pixel_art'),
    image: 'https://files.picturetodrawing.com/styles/pixel-art.webp'
  },
  {
    id: 'clay',
    name: t('styles.clay'),
    image: 'https://files.picturetodrawing.com/styles/clay.webp'
  },
  {
    id: 'low-poly',
    name: t('styles.low_poly'),
    image: 'https://files.picturetodrawing.com/styles/low-poly.webp'
  },

];
