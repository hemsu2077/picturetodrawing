// Re-export shared types
export { Drawing } from './shared-types';

export interface GeneratedImage {
  url: string;
  filename: string;
  provider: string;
  location?: string;
  bucket?: string;
  key?: string;
}

export interface DrawingStyle {
  id: string;
  name: string;
  image: string;
}

export interface AspectRatio {
  value: string;
  label: string;
  description?: string;
}

export interface UploadedImage {
  file: File;
  preview: string;
}
