export type HeroBackgroundVariant = "default" | "line-drawing";

export const photoTransformationConfigMap = {
  "photo-to-line-drawing": {
    slug: "photo-to-line-drawing",
    generator: {
      defaultStyle: "line-drawing",
      defaultModel: "nano-banana",
    },
    heroBackgroundVariant: "line-drawing" as HeroBackgroundVariant,
    metaDefaults: {
      title: "Photo to Line Drawing Converter - AI-Powered Image to Line Art Tool",
      description:
        "Convert photos to professional line drawings instantly with our AI-powered tool. Perfect for crafts, tattoos, embroidery patterns, and digital art. Free to try, secure processing.",
    },
  },
  "photo-to-cartoon": {
    slug: "photo-to-cartoon",
    generator: {
      defaultStyle: "superhero-comic",
      defaultModel: "nano-banana",
    },
    heroBackgroundVariant: "default" as HeroBackgroundVariant,
    metaDefaults: {
      title: "Photo to Cartoon Converter - Turn Pictures into Cartoon Art with AI",
      description:
        "Transform your photos into playful cartoon illustrations instantly. Perfect for avatars, social media, and creative projects.",
    },
  },
} as const;

export type PhotoTransformationSlug = keyof typeof photoTransformationConfigMap;

export type PhotoTransformationConfig =
  (typeof photoTransformationConfigMap)[PhotoTransformationSlug];

export const photoTransformationSlugs = Object.keys(
  photoTransformationConfigMap
) as PhotoTransformationSlug[];

export function getPhotoTransformationConfig(
  slug: PhotoTransformationSlug
): PhotoTransformationConfig {
  const config = photoTransformationConfigMap[slug];

  if (!config) {
    throw new Error(`Unknown photo transformation slug: ${slug}`);
  }

  return config;
}
