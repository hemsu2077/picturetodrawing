
export const photoTransformationConfigMap = {
  "photo-to-line-drawing": {
    slug: "photo-to-line-drawing",
    generator: {
      defaultStyle: "line-drawing",
      defaultModel: "nano-banana",
    },

  },
  "photo-to-cartoon": {
    slug: "photo-to-cartoon",
    generator: {
      defaultStyle: "pure-cartoon",
      defaultModel: "default",
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
