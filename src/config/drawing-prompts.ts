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
    'superhero-comic': 'transform the image to a drawing, the drawing should be in the style of Classic American comic book style, characterized by thick line art, solid flat colors, exaggerated dynamic poses, simplified shading, and dense compositions, emphasizing overall drama and visual impact. Just like a real comic, Try to make it look as painted as possible.',
    'manga': 'transform the image to a drawing, the drawing should be in the style of Japanese/Korean manga style, clean lines, black and white tones, expressive emotions, dynamic composition. Just like a real manga, Try to make it look as painted as possible.'
  },
  'flux-kontext-pro': {
    'line-drawing': 'Convert this photo into a clean black and white line illustration. Keep only the main outlines, no shading. Make it look like a coloring book page with clear contours and simplified details. Remove the background and focus on the subject.',
    'pencil-sketch': 'transform the image to a drawing, the drawing should be in the style of black and white pencil sketch, Try to make it look as painted as possible.',
    'charcoal-drawing': 'transform the image to a drawing, the drawing should be in the style of black and white charcoal drawing, Try to make it look as painted as possible.',
    'color-pencil-drawing': 'transform the image to a drawing, the drawing should be in the style of color pencil drawing, Try to make it look as painted as possible.',
    'watercolor-painting': 'transform the image to a drawing, the drawing should be in the style of watercolor painting, Try to make it look as painted as possible.',
    'inkart': 'transform the image to a drawing, the drawing should be in the style of ink art, Try to make it look as painted as possible.',
    'superhero-comic': 'transform the image to a drawing, the drawing should be in the style of American superhero comic style, rough lines, exaggerated colors. Just like a real comic, Try to make it look as painted as possible.',
    'manga': 'transform the image to a drawing, the drawing should be in the style of Japanese/Korean manga style, clean lines, black and white tones, expressive emotions, dynamic composition. Just like a real manga, Try to make it look as painted as possible.'
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
