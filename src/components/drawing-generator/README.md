# Drawing Generator Component

An AI-powered component that transforms photos into artistic drawings using various styles.

## Features

- **Image Upload**: Drag & drop or click to upload images (JPG, PNG, WEBP, HEIC)
- **Style Selection**: 6 artistic styles with preview thumbnails:
  - Pencil Sketch
  - Line Drawing  
  - Charcoal Drawing
  - Color Pencil Drawing
  - Watercolor Painting
  - InkArt
- **Aspect Ratio Control**: Choose output dimensions (Auto, 1:1, 4:3, 3:4, 16:9, 9:16)
- **Real-time Generation**: Integrated with `/api/gen-drawing` endpoint
- **Download Results**: Generated images can be downloaded directly

## Usage

### Basic Usage

```tsx
import DrawingGenerator from '@/components/drawing-generator';

export default function MyPage() {
  return (
    <div className="container mx-auto py-8">
      <DrawingGenerator />
    </div>
  );
}
```

### Individual Components

```tsx
import { 
  ImageUpload, 
  StyleSelector, 
  RatioSelector, 
  ResultDisplay 
} from '@/components/drawing-generator';

// Use individual components for custom layouts
```

## Component Structure

```
drawing-generator/
├── index.tsx           # Main container component
├── image-upload.tsx    # Image upload with drag & drop
├── style-selector.tsx  # Art style selection grid
├── ratio-selector.tsx  # Aspect ratio controls
├── result-display.tsx  # Generated image display
├── types.ts           # TypeScript interfaces
└── README.md          # This file
```

## API Integration

The component integrates with `/api/gen-drawing` which expects:

```json
{
  "style": "pencil-sketch", // Style ID
  "image": "base64string",  // Base64 encoded image
  "ratio": "1:1"           // Aspect ratio (null for auto)
}
```

## Styling

Built with:
- Tailwind CSS for styling
- Shadcn UI components
- Lucide React icons
- Responsive design patterns

## Requirements

- Next.js 13+ with App Router
- React 18+
- Tailwind CSS
- Shadcn UI components installed
