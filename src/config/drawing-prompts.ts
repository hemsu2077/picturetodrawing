// Drawing generation prompts configuration keyed directly by style.

export type DrawingPromptConfig = Record<string, string>;

// Styles that should use nano-banana model
// All other styles will use flux-kontext-pro (default)
const NANO_BANANA_STYLES = new Set(['line-drawing', 'line-art', "pencil-sketch-2"]);

// Helper function to determine which model to use for a given style
export function getModelForStyle(style: string): 'nano-banana' | 'flux-kontext-pro' {
  return NANO_BANANA_STYLES.has(style) ? 'nano-banana' : 'flux-kontext-pro';
}

export const drawingPrompts: DrawingPromptConfig = {
  'line-drawing': 'Convert images to black and white line art. Only keep outlines, no shading. Make it look like a coloring book page with clear contours and simplified details.',
  'line-drawing-2': 'Change this picture to a clean black and white line illustration. Make it look like a coloring book page with clear contours and simplified details.',
  'bold-outline': 'transform to black-and-white cartoon line art . Clean bold outlines, coloring book style with no shading',
  'line-art': 'Convert photo to artistic minimalist continuous line illustration, abstract expression, black and white',
  'pencil-sketch': 'transform the image to a drawing, the drawing should be in the style of black and white pencil sketch, Try to make it look as painted as possible. White background. Maintaining the exact original composition and placement.',
  'pencil-sketch-2': 'transform the image to a drawing, the drawing should be in the style of black and white pencil sketch, Try to make it look as painted as possible.',
  'charcoal-drawing': 'transform the image to a drawing, the drawing should be in the style of black and white charcoal drawing, Try to make it look as painted as possible.',
  'color-pencil-drawing': 'transform the image to a drawing, the drawing should be in the style of color pencil drawing, Try to make it look as painted as possible.',
  'splash-watercolor-art': 'transform to romantic watercolor portrait, expressive paint splashes, artistic ink and paint strokes, textured paper background, expressive composition, keeping the original subject recognizable and centered, while allowing colorful splashes around it for artistic energy',
  'simple-drawing': 'transform to a simple drawing with bold clear outlines, bright colors, smooth shapes, and a playful minimalist style',
  'kawaii-pastel-doodle': 'Transform to Kawaii pastel doodle while maintaining the exact original composition and placement',
  'watercolor-painting': 'transform the image to a drawing, the drawing should be in the style of watercolor painting, Try to make it look as painted as possible.',
  'inkart': 'transform the image to a drawing, the drawing should be in the style of ink art, Try to make it look as painted as possible.',
  'van-gogh': 'Transfrom to Van Gogh style, with thick impasto brushstrokes, swirling textures, vibrant contrasting colors, and expressive emotional intensity.',
  'oil-painting': 'tranform picture to artistic oil painting, fine art style, visible brush strokes, rich oil texture, on canvas. Maintaining composition',
  'pop-art': 'Transform to Pop Art style, while maintaining the exact original composition and placement',
  'psychedelic-art': 'Transform to Psychedelic poster art while maintaining the exact original composition and placement',
  'graffiti-street-art': 'Transform to expressive graffiti street art, dynamic composition, bold neon colors, paint drips and splatter, fine art graffiti aesthetic while maintaining the exact original composition and placement',
  'pure-cartoon': 'Transform photos into a children\'s cartoon style, usually with exaggerated facial features, simple lines, and pure colors',
  'ghibli-style': 'Please convert this realistic image into a Ghibli-style artwork',
  '90s-retro-anime': 'Transform to 90s retro anime style, while maintaining the exact original composition and placement',
  'shounen-anime': 'Transform to photo to anime portrait in Demon Slayer style, sharp outlines, glowing katana light, traditional Japanese pattern, dynamic lighting, vibrant cel shading, detailed face, anime illustration',
  'shoujo-anime': 'transform photo to anime in Your Name style, realistic lighting, detailed clouds, cinematic background, soft pastel tones, anime realism',
  'pixar-3d': 'transform the image to Pixar style 3D animation, completely animated, exaggerated facial expressions, rounded soft features, smooth textures, vibrant warm colors, cinematic lighting, whimsical atmosphere, no realistic skin pores, no photography.',
  'disney-3d': 'transform the image to Disney style, fairy-tale 3D animation, extremely whimsical and magical atmosphere, very large sparkling eyes, soft rounded facial features, vibrant dreamy pastel colors, elegant and smooth textures, romantic cinematic lighting, completely cartoonish, no realistic skin pores.',
  '3d-chibi': 'Transform to 3D Chibi style, 2-heads-tall, soft facial expression, while maintaining the exact original composition and placement',
  'simpsons': 'The Simpsons style, 2D flat cartoon, thick black outlines, bright flat colors, exaggerated and humorous characters, minimal shading, simple background, satirical and comical atmosphere, completely non-realistic.',
  'south-park': 'South Park style, 2D paper cut-out cartoon, simple round faces with no nose or tiny nose, large white circular eyes, flat solid bright colors, minimal details, no shading, no outlines, extremely simplistic and crude design, comical and satirical atmosphere.',
  'rick-morty': 'Transform to Rick & Morty style, while maintaining the exact original composition and placement',
  'snoopy': 'Transform to Snoopy style, while maintaining the exact original composition and placement. Clean black outlines, simple shapes, minimal details, soft pastel colors, flat shading, round proportions, cute and warm cartoon look, Peanuts comic aesthetics, white background, gentle lighting',
  'pixel-art': 'transform the image to a 16-bit pixel art',
  'clay': 'Cartoonish claymation stop-motion style, colorful modeling clay objects and scenes, rounded and exaggerated shapes, playful and whimsical, highly stylized, visible fingerprints and handcrafted imperfections, vibrant saturated colors, no realistic details, no CGI, no photographic textures, completely handmade look.',
  'superhero-comic': 'transform the image to a drawing, the drawing should be in the style of American superhero comic style, rough lines, exaggerated colors. Just like a real comic, Try to make it look as painted as possible.',
  'manga': 'transform the image to a drawing, the drawing should be in the style of Japanese/Korean manga style, clean lines, black and white tones, expressive emotions, dynamic composition. Just like a real manga, Try to make it look as painted as possible.',
  'cyberpunk-neon': 'Transform to cyberpunk neon noir style, while maintaining the exact original composition and placement',
  'gta-style': 'Transform to GTA style, while maintaining the exact original composition and placement',
  'low-poly': 'transform to low poly style, large flat polygons, geometric shapes, faceted surfaces, simplified details, sharp edges, minimal texture, strong light and shadow contrast, vibrant yet natural color palette, 3D polygonal look, resembling digital sculpture or origami art',
};

// Helper function to get prompt for specific model and style
export function getDrawingPrompt(_model: string, style: string): string {
  const prompt = drawingPrompts[style];

  if (!prompt) {
    // Fallback to a generic prompt if style not found
    return `transform the image to a drawing, the drawing should be in the style of ${style}, Try to make it look as painted as possible.`;
  }

  return prompt;
}

// Helper function to get all available styles for a model
export function getAvailableStyles(model: string): string[] {
  const modelKey = model === 'nano-banana' ? 'nano-banana' : 'flux-kontext-pro';
  return Object.keys(drawingPrompts).filter(
    (style) => getModelForStyle(style) === modelKey
  );
}
