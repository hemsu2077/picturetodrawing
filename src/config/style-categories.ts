export interface StyleCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  styles: string[]; // style IDs
}

export interface StyleMetadata {
  id: string;
  hasLandingPage: boolean;
  landingPageUrl?: string;
  description: string;
}

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: 'drawing',
    name: 'Photo to Drawing',
    slug: 'drawing',
    description: 'Transform your photos into classic line drawings and sketches. Perfect for creating artistic portraits, illustrations, and minimalist designs with clean lines and elegant simplicity.',
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
    name: 'Photo to Art',
    slug: 'art',
    description: 'Convert your photos into stunning artistic masterpieces. From watercolor paintings to Van Gogh-inspired styles, explore various painting techniques and artistic expressions.',
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
    name: 'Photo to Cartoon',
    slug: 'cartoon',
    description: 'Turn your photos into fun cartoon characters. Choose from popular cartoon styles including Simpsons, South Park, Rick & Morty, and more iconic animation styles.',
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
    name: 'Photo to Anime',
    slug: 'anime',
    description: 'Transform your photos into beautiful anime and manga art. From Studio Ghibli to modern anime styles, create stunning Japanese animation-inspired artwork.',
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
    name: 'Photo to 3D & Modern',
    slug: 'modern',
    description: 'Explore contemporary and digital art styles. From pixel art to cyberpunk aesthetics, discover modern artistic transformations for your photos.',
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
    landingPageUrl: '/photo-to-line-drawing',
    description: 'Convert your photos into elegant line drawings with clean, minimalist strokes.'
  },
  'ghibli-style': {
    id: 'ghibli-style',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Transform your photos into magical Studio Ghibli-inspired anime art.'
  },
  'line-drawing-2': {
    id: 'line-drawing-2',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing',
    description: 'Alternative line drawing style with softer, more organic lines.'
  },
  'line-art': {
    id: 'line-art',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing',
    description: 'Clean line art style perfect for coloring books and illustrations.'
  },
  'bold-outline': {
    id: 'bold-outline',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-line-drawing',
    description: 'Strong, bold outlines that make your photos pop with comic-style edges.'
  },
  'pencil-sketch': {
    id: 'pencil-sketch',
    hasLandingPage: false,
    description: 'Realistic pencil sketch effect with natural shading and texture.'
  },
  'pencil-sketch-2': {
    id: 'pencil-sketch-2',
    hasLandingPage: false,
    description: 'Softer pencil sketch style with delicate strokes and subtle details.'
  },
  'charcoal-drawing': {
    id: 'charcoal-drawing',
    hasLandingPage: false,
    description: 'Dramatic charcoal drawing effect with rich blacks and expressive marks.'
  },
  'simple-drawing': {
    id: 'simple-drawing',
    hasLandingPage: false,
    description: 'Minimalist drawing style with simplified shapes and clean lines.'
  },
  'inkart': {
    id: 'inkart',
    hasLandingPage: false,
    description: 'Traditional ink art style with flowing brushstrokes and artistic flair.'
  },
  'watercolor-painting': {
    id: 'watercolor-painting',
    hasLandingPage: false,
    description: 'Beautiful watercolor painting effect with soft colors and fluid textures.'
  },
  'splash-watercolor-art': {
    id: 'splash-watercolor-art',
    hasLandingPage: false,
    description: 'Dynamic watercolor style with vibrant splashes and artistic energy.'
  },
  'oil-painting': {
    id: 'oil-painting',
    hasLandingPage: false,
    description: 'Classic oil painting effect with rich textures and painterly brushwork.'
  },
  'van-gogh': {
    id: 'van-gogh',
    hasLandingPage: false,
    description: 'Transform photos into Van Gogh-inspired masterpieces with swirling brushstrokes.'
  },
  'pop-art': {
    id: 'pop-art',
    hasLandingPage: false,
    description: 'Bold pop art style with vibrant colors and graphic design elements.'
  },
  'psychedelic-art': {
    id: 'psychedelic-art',
    hasLandingPage: false,
    description: 'Trippy psychedelic art with vivid colors and surreal patterns.'
  },
  'graffiti-street-art': {
    id: 'graffiti-street-art',
    hasLandingPage: false,
    description: 'Urban graffiti style with street art aesthetics and bold colors.'
  },
  'kawaii-pastel-doodle': {
    id: 'kawaii-pastel-doodle',
    hasLandingPage: false,
    description: 'Cute kawaii style with pastel colors and adorable doodle elements.'
  },
  'color-pencil-drawing': {
    id: 'color-pencil-drawing',
    hasLandingPage: false,
    description: 'Colored pencil drawing effect with vibrant hues and sketch texture.'
  },
  'pure-cartoon': {
    id: 'pure-cartoon',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Classic cartoon style with bold outlines and vibrant colors.'
  },
  'simpsons': {
    id: 'simpsons',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Transform into a Simpsons character with iconic yellow skin and style.'
  },
  'south-park': {
    id: 'south-park',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Become a South Park character with the show\'s distinctive art style.'
  },
  'rick-morty': {
    id: 'rick-morty',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Rick and Morty style transformation with the show\'s unique aesthetic.'
  },
  'snoopy': {
    id: 'snoopy',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Peanuts-inspired style with Snoopy\'s classic comic strip look.'
  },
  'superhero-comic': {
    id: 'superhero-comic',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Epic superhero comic book style with dynamic action and bold colors.'
  },
  'pixar-3d': {
    id: 'pixar-3d',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Pixar-style 3D animation look with smooth rendering and charm.'
  },
  'disney-3d': {
    id: 'disney-3d',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Disney 3D animation style with magical and polished aesthetics.'
  },
  '90s-retro-anime': {
    id: '90s-retro-anime',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Nostalgic 90s anime style with retro aesthetics and classic look.'
  },
  'shounen-anime': {
    id: 'shounen-anime',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Action-packed shounen anime style with dynamic energy and bold lines.'
  },
  'shoujo-anime': {
    id: 'shoujo-anime',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Beautiful shoujo anime style with sparkles and romantic aesthetics.'
  },
  'manga': {
    id: 'manga',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Black and white manga style perfect for comic book illustrations.'
  },
  '3d-chibi': {
    id: '3d-chibi',
    hasLandingPage: true,
    landingPageUrl: '/photo-to-cartoon',
    description: 'Adorable 3D chibi style with cute proportions and charm.'
  },
  'pixel-art': {
    id: 'pixel-art',
    hasLandingPage: false,
    description: 'Retro pixel art style reminiscent of classic video games.'
  },
  'clay': {
    id: 'clay',
    hasLandingPage: false,
    description: 'Claymation style with tactile, sculpted appearance.'
  },
  'low-poly': {
    id: 'low-poly',
    hasLandingPage: false,
    description: 'Modern low-poly 3D style with geometric facets and clean edges.'
  },
  'cyberpunk-neon': {
    id: 'cyberpunk-neon',
    hasLandingPage: false,
    description: 'Futuristic cyberpunk style with neon lights and dystopian aesthetics.'
  },
  'gta-style': {
    id: 'gta-style',
    hasLandingPage: false,
    description: 'GTA-inspired art style with urban edge and game aesthetics.'
  }
};

export function getStyleMetadata(styleId: string): StyleMetadata | undefined {
  return STYLE_METADATA[styleId];
}

export function getCategoryById(categoryId: string): StyleCategory | undefined {
  return STYLE_CATEGORIES.find(cat => cat.id === categoryId);
}
