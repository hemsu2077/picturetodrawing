# Drawing Styles - URL Parameter Strategy

## Overview

This document explains the URL parameter strategy for drawing styles navigation, where landing pages and style parameters work together.

## Strategy

### Core Principle
**URL parameter `?style={id}` is ALWAYS included**, regardless of whether a landing page exists.

### Two Navigation Patterns

#### 1. With Landing Page
Multiple styles can share the same landing page, each with their specific style parameter.

**Example - Photo to Line Drawing:**
- Line Drawing → `/photo-to-line-drawing?style=line-drawing#drawing-generator`
- Line Drawing 2 → `/photo-to-line-drawing?style=line-drawing-2#drawing-generator`
- Line Art → `/photo-to-line-drawing?style=line-art#drawing-generator`
- Bold Outline → `/photo-to-line-drawing?style=bold-outline#drawing-generator`

**Example - Photo to Cartoon:**
- Ghibli Style → `/photo-to-cartoon?style=ghibli-style#drawing-generator`
- Pure Cartoon → `/photo-to-cartoon?style=pure-cartoon#drawing-generator`
- Simpsons → `/photo-to-cartoon?style=simpsons#drawing-generator`
- Pixar 3D → `/photo-to-cartoon?style=pixar-3d#drawing-generator`

#### 2. Without Landing Page
Styles without dedicated landing pages go to homepage with style parameter.

**Example:**
- Pencil Sketch → `/?style=pencil-sketch#drawing-generator`
- Watercolor → `/?style=watercolor-painting#drawing-generator`

## Benefits

### 1. Flexible Content Organization
- One landing page can serve multiple related styles
- Each style maintains its unique identity via parameter
- Easy to add new styles without creating new pages

### 2. Better SEO
- Landing pages can rank for category keywords (e.g., "photo to line drawing")
- Style parameters allow tracking which specific style users prefer
- Consistent URL structure across all styles

### 3. Improved UX
- Users land on relevant content page
- Style is automatically pre-selected in generator
- Seamless transition from browsing to generating

### 4. Analytics & Tracking
- Track which landing pages drive most conversions
- Track which specific styles are most popular
- A/B test different landing page content for same styles

## Implementation

### StyleCard Component
```typescript
const handleClick = () => {
  // Always include style parameter
  const styleParam = `?style=${id}#drawing-generator`;
  
  if (hasLandingPage && landingPageUrl) {
    // Navigate to landing page with style parameter
    router.push(`${landingPageUrl}${styleParam}`);
  } else {
    // Navigate to homepage with style parameter
    router.push(`/${styleParam}`);
  }
};
```

### Configuration Structure
```typescript
interface StyleMetadata {
  id: string;
  hasLandingPage: boolean;      // Whether to use landing page
  landingPageUrl?: string;       // Landing page path (if hasLandingPage=true)
  description: string;
}
```

## Current Landing Page Mapping

### /photo-to-line-drawing
Serves all line-based drawing styles:
- ✅ line-drawing
- ✅ line-drawing-2
- ✅ line-art
- ✅ bold-outline

### /photo-to-cartoon
Serves all cartoon and anime styles:
- ✅ ghibli-style
- ✅ pure-cartoon
- ✅ simpsons
- ✅ south-park
- ✅ rick-morty
- ✅ snoopy
- ✅ superhero-comic
- ✅ pixar-3d
- ✅ disney-3d
- ✅ 90s-retro-anime
- ✅ shounen-anime
- ✅ shoujo-anime
- ✅ manga
- ✅ 3d-chibi

### Homepage (/)
Serves styles without dedicated landing pages:
- pencil-sketch
- pencil-sketch-2
- charcoal-drawing
- simple-drawing
- inkart
- watercolor-painting
- splash-watercolor-art
- oil-painting
- van-gogh
- pop-art
- psychedelic-art
- graffiti-street-art
- kawaii-pastel-doodle
- color-pencil-drawing
- pixel-art
- clay
- low-poly
- cyberpunk-neon
- gta-style

## Future Expansion

### Adding New Landing Pages
When creating a new landing page (e.g., `/photo-to-watercolor`):

1. Create the landing page
2. Update `style-categories.ts`:
   ```typescript
   'watercolor-painting': {
     id: 'watercolor-painting',
     hasLandingPage: true,
     landingPageUrl: '/photo-to-watercolor',
     description: '...'
   },
   'splash-watercolor-art': {
     id: 'splash-watercolor-art',
     hasLandingPage: true,
     landingPageUrl: '/photo-to-watercolor',
     description: '...'
   }
   ```
3. No changes needed to StyleCard component!

### URL Parameter Handling
The drawing generator automatically reads the `style` parameter and pre-selects the style, regardless of which page the user lands on.

## Testing Checklist

- [ ] Click style with landing page → Correct landing page + style parameter
- [ ] Click style without landing page → Homepage + style parameter
- [ ] Style parameter correctly pre-selects style in generator
- [ ] Hash fragment scrolls to generator section
- [ ] Multiple styles sharing same landing page work correctly
- [ ] Browser back/forward navigation works
- [ ] Direct URL access with style parameter works

## Related Files

- `/src/components/drawing-styles/style-card.tsx` - Navigation logic
- `/src/config/style-categories.ts` - Style metadata and landing page mapping
- `/src/components/drawing-generator/index.tsx` - URL parameter reading

---

**Version:** 1.0  
**Created:** 2025-10-08  
**Status:** ✅ Implemented
