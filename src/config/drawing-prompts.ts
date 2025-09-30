// Drawing generation prompts configuration
// Organized by model and style for easy maintenance and expansion

export interface DrawingPromptConfig {
  [model: string]: {
    [style: string]: string;
  };
}

export const drawingPrompts: DrawingPromptConfig = {
  'nano-banana': {
    'line-drawing': 'Convert images to line art. Only keep outlines, no shading. Make it look like a coloring book page with clear contours and simplified details.',
    'pencil-sketch': 'Convert this image into a black-and-white pencil sketch with rough, hand-drawn strokes.',
    'charcoal-drawing': 'transform the image to charcoal drawing, which means A black and white drawing with expressive, rough and hand-drawn strokes and highlights created by hand erasing.',
    'color-pencil-drawing': 'transform the image to color pencil drawing, Its clearly hand-drawn, with visible rough edges.',
    'watercolor-painting': 'transform the image to watercolor painting, Color gradation with distinct hand-painted traces,wash style illustration, using the wet-on-wet technique for the background and expressive brushstrokes',
    'inkart': 'transform the image to a monochromatic pen and ink illustration using detailed hatching and cross-hatching',
    'pure-cartoon': 'Transform the whole photo into a children\'s cartoon style, usually with simple lines, Vibrant yet clean colors',
    'ghibli-style': 'Redraw this photo in Studio Ghibli style, hand-drawn 2D animation look, soft natural colors, warm and dreamy atmosphere, magical creatures and imaginative worlds, gentle and cinematic lighting, rounded and simple shapes, nostalgic and heartwarming aesthetic, no realism, no CGI, no photorealistic textures.',
    'pixar-3d': 'transform the image to Pixar style 3D animation, completely animated, exaggerated facial expressions, rounded soft features, smooth textures, vibrant warm colors, cinematic lighting, whimsical atmosphere, no realistic skin pores, no photography.',
    'disney-3d': 'transform the image to Disney style, fairy-tale 3D animation, extremely whimsical and magical atmosphere, very large sparkling eyes, soft rounded facial features, vibrant dreamy pastel colors, elegant and smooth textures, romantic cinematic lighting, completely cartoonish, no realistic skin pores.',
    'simpsons': 'The Simpsons style, 2D flat cartoon, thick black outlines, bright flat colors, exaggerated and humorous characters, minimal shading, simple background, satirical and comical atmosphere, completely non-realistic.',
    'south-park': 'South Park style, 2D paper cut-out cartoon, simple round faces with no nose or tiny nose, large white circular eyes, flat solid bright colors, minimal details, no shading, no outlines, extremely simplistic and crude design, comical and satirical atmosphere.',
    'pixel-art': 'transform the image to a 16-bit pixel art',
    'clay': 'Cartoonish claymation stop-motion style, colorful modeling clay objects and scenes, rounded and exaggerated shapes, playful and whimsical, highly stylized, visible fingerprints and handcrafted imperfections, vibrant saturated colors, no realistic details, no CGI, no photographic textures, completely handmade look.',
    'superhero-comic': 'transform the image to a drawing, the drawing should be in the style of Classic American comic book style, characterized by thick line art, solid flat colors, exaggerated dynamic poses, simplified shading, and dense compositions, emphasizing overall drama and visual impact. Just like a real comic, Try to make it look as painted as possible.',
    'manga': 'transform the image to a drawing, the drawing should be in the style of Japanese/Korean manga style, clean lines, black and white tones, expressive emotions, dynamic composition. Just like a real manga, Try to make it look as painted as possible.'
  },
  'flux-kontext-pro': {
    'line-drawing': 'Change this picture to a clean black and white line illustration. Make it look like a coloring book page with clear contours and simplified details.',
    'pencil-sketch': 'transform the image to a drawing, the drawing should be in the style of black and white pencil sketch, Try to make it look as painted as possible.',
    'charcoal-drawing': 'transform the image to a drawing, the drawing should be in the style of black and white charcoal drawing, Try to make it look as painted as possible.',
    'color-pencil-drawing': 'transform the image to a drawing, the drawing should be in the style of color pencil drawing, Try to make it look as painted as possible.',
    'kawaii-pastel-doodle': 'Transform to Kawaii pastel doodle while maintaining the exact original composition and placement',
    'watercolor-painting': 'transform the image to a drawing, the drawing should be in the style of watercolor painting, Try to make it look as painted as possible.',
    'inkart': 'transform the image to a drawing, the drawing should be in the style of ink art, Try to make it look as painted as possible.',
    'van-gogh': 'Transfrom to Van Gogh style, with thick impasto brushstrokes, swirling textures, vibrant contrasting colors, and expressive emotional intensity.',
    'pop-art': 'Transform to Pop Art style, while maintaining the exact original composition and placement',
    'pure-cartoon': 'Transform photos into a children\'s cartoon style, usually with exaggerated facial features, simple lines, and pure colors',
    'ghibli-style': 'Please convert this realistic image into a Ghibli-style artwork',
    'pixar-3d': 'transform the image to Pixar style 3D animation, completely animated, exaggerated facial expressions, rounded soft features, smooth textures, vibrant warm colors, cinematic lighting, whimsical atmosphere, no realistic skin pores, no photography.',
    '90s-retro-anime': 'Transform to 90s retro anime style, while maintaining the exact original composition and placement',
    'disney-3d': 'transform the image to Disney style, fairy-tale 3D animation, extremely whimsical and magical atmosphere, very large sparkling eyes, soft rounded facial features, vibrant dreamy pastel colors, elegant and smooth textures, romantic cinematic lighting, completely cartoonish, no realistic skin pores.',
    'simpsons': 'The Simpsons style, 2D flat cartoon, thick black outlines, bright flat colors, exaggerated and humorous characters, minimal shading, simple background, satirical and comical atmosphere, completely non-realistic.',
    'south-park': 'South Park style, 2D paper cut-out cartoon, simple round faces with no nose or tiny nose, large white circular eyes, flat solid bright colors, minimal details, no shading, no outlines, extremely simplistic and crude design, comical and satirical atmosphere.',
    'rick-morty': 'Transform to Rick & Morty style, while maintaining the exact original composition and placement',
    'snoopy': 'Transform to Snoopy style, while maintaining the exact original composition and placement',
    'pixel-art': 'transform the image to a 16-bit pixel art',
    'clay': 'Cartoonish claymation stop-motion style, colorful modeling clay objects and scenes, rounded and exaggerated shapes, playful and whimsical, highly stylized, visible fingerprints and handcrafted imperfections, vibrant saturated colors, no realistic details, no CGI, no photographic textures, completely handmade look.',
    'superhero-comic': 'transform the image to a drawing, the drawing should be in the style of American superhero comic style, rough lines, exaggerated colors. Just like a real comic, Try to make it look as painted as possible.',
    'manga': 'transform the image to a drawing, the drawing should be in the style of Japanese/Korean manga style, clean lines, black and white tones, expressive emotions, dynamic composition. Just like a real manga, Try to make it look as painted as possible.',
    'cyberpunk-neon': 'Transform to cyberpunk neon noir style, while maintaining the exact original composition and placement',
    'gta-style': 'Transform to GTA style, while maintaining the exact original composition and placement',
  }
};

// Helper function to get prompt for specific model and style
export function getDrawingPrompt(model: string, style: string): string {
  const modelKey = model === 'nano-banana' ? 'nano-banana' : 'flux-kontext-pro';
  const prompt = drawingPrompts[modelKey]?.[style];
  
  if (!prompt) {
    // Fallback to a generic prompt if style not found
    return `transform the image to a drawing, the drawing should be in the style of ${style}, Try to make it look as painted as possible.`;
  }
  
  return prompt;
}

// Helper function to get all available styles for a model
export function getAvailableStyles(model: string): string[] {
  const modelKey = model === 'nano-banana' ? 'nano-banana' : 'flux-kontext-pro';
  return Object.keys(drawingPrompts[modelKey] || {});
}
