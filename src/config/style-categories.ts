export interface StyleCategory {
  id: string;
  slug: string;
  styles: string[]; // style IDs
}

export interface StyleMetadata {
  id: string;
  hasLandingPage: boolean;
  landingPageUrl?: string;
}

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: 'drawing',
    slug: 'drawing',
    styles: [
      'pencil-sketch',
      'pencil-sketch-2',
      'line-drawing',
      'line-drawing-2',
      'line-art',
      'bold-outline',
      'charcoal-drawing',
      'simple-drawing',
      'inkart'
    ]
  },
  {
    id: 'art',
    slug: 'art',
    styles: [
      'watercolor-painting',
      'splash-watercolor-art',
      'oil-painting',
      'van-gogh',
      'pop-art',
      'psychedelic-art',
      'graffiti-street-art',
      'kawaii-pastel-doodle',
      'color-pencil-drawing'
    ]
  },
  {
    id: 'cartoon',
    slug: 'cartoon',
    styles: [
      'pure-cartoon',
      'simpsons',
      'south-park',
      'rick-morty',
      'snoopy',
      'superhero-comic',
      'pixar-3d',
      'disney-3d'
    ]
  },
  {
    id: 'anime',
    slug: 'anime',
    styles: [
      'ghibli-style',
      '90s-retro-anime',
      'shounen-anime',
      'shoujo-anime',
      'manga',
      '3d-chibi'
    ]
  },
  {
    id: 'modern',
    slug: 'modern',
    styles: [
      'pixel-art',
      'clay',
      'low-poly',
      'cyberpunk-neon',
      'gta-style'
    ]
  }
];

export const STYLE_METADATA: Record<string, StyleMetadata> = {
  'line-drawing': {
    id: 'line-drawing',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing'
  },
  'ghibli-style': {
    id: 'ghibli-style',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'line-drawing-2': {
    id: 'line-drawing-2',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing'
  },
  'line-art': {
    id: 'line-art',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing'
  },
  'bold-outline': {
    id: 'bold-outline',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing'
  },
  'pencil-sketch': {
    id: 'pencil-sketch',
    hasLandingPage: false
  },
  'pencil-sketch-2': {
    id: 'pencil-sketch-2',
    hasLandingPage: false
  },
  'charcoal-drawing': {
    id: 'charcoal-drawing',
    hasLandingPage: false
  },
  'simple-drawing': {
    id: 'simple-drawing',
    hasLandingPage: false
  },
  'inkart': {
    id: 'inkart',
    hasLandingPage: false
  },
  'watercolor-painting': {
    id: 'watercolor-painting',
    hasLandingPage: false
  },
  'splash-watercolor-art': {
    id: 'splash-watercolor-art',
    hasLandingPage: false
  },
  'oil-painting': {
    id: 'oil-painting',
    hasLandingPage: false
  },
  'van-gogh': {
    id: 'van-gogh',
    hasLandingPage: false
  },
  'pop-art': {
    id: 'pop-art',
    hasLandingPage: false
  },
  'psychedelic-art': {
    id: 'psychedelic-art',
    hasLandingPage: false
  },
  'graffiti-street-art': {
    id: 'graffiti-street-art',
    hasLandingPage: false
  },
  'kawaii-pastel-doodle': {
    id: 'kawaii-pastel-doodle',
    hasLandingPage: false
  },
  'color-pencil-drawing': {
    id: 'color-pencil-drawing',
    hasLandingPage: false
  },
  'pure-cartoon': {
    id: 'pure-cartoon',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'simpsons': {
    id: 'simpsons',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'south-park': {
    id: 'south-park',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'rick-morty': {
    id: 'rick-morty',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'snoopy': {
    id: 'snoopy',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'superhero-comic': {
    id: 'superhero-comic',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'pixar-3d': {
    id: 'pixar-3d',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'disney-3d': {
    id: 'disney-3d',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  '90s-retro-anime': {
    id: '90s-retro-anime',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'shounen-anime': {
    id: 'shounen-anime',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'shoujo-anime': {
    id: 'shoujo-anime',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'manga': {
    id: 'manga',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon'
  },
  'pixel-art': {
    id: 'pixel-art',
    hasLandingPage: false
  },
  'clay': {
    id: 'clay',
    hasLandingPage: false
  },
  'low-poly': {
    id: 'low-poly',
    hasLandingPage: false
  },
  'cyberpunk-neon': {
    id: 'cyberpunk-neon',
    hasLandingPage: false
  },
  'gta-style': {
    id: 'gta-style',
    hasLandingPage: false
  }
};

export function getStyleMetadata(styleId: string): StyleMetadata | undefined {
  return STYLE_METADATA[styleId];
}

export function getCategoryById(categoryId: string): StyleCategory | undefined {
  return STYLE_CATEGORIES.find(cat => cat.id === categoryId);
}
