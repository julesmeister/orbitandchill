# Guide System Documentation

## Overview

The guide system provides a consistent, reusable template for creating educational content with the Synapsas design system. All guides share the same layout, navigation, and progress tracking while allowing unique content customization.

## File Structure

```
src/components/guides/
├── GuideTemplate.tsx       # Main layout template
├── GuideComponents.tsx     # Reusable UI components
└── README.md              # This documentation

src/app/guides/[guide-name]/
├── page.tsx               # Guide page component
└── content.tsx            # Guide content (for large guides)
```

## Components

### GuideTemplate.tsx
Main layout component providing:
- **Header**: Navigation, progress bar, level indicators
- **Sidebar**: Section navigation with completion tracking  
- **Content Area**: Dynamic section content rendering
- **Navigation**: Previous/Next buttons, completion tracking
- **Quick Actions**: Customizable action cards

### GuideComponents.tsx
Reusable UI components:

#### HeroCard
Hero section with icon, title, and description.
```tsx
<HeroCard
  icon="🌟"
  title="Your Cosmic Blueprint"
  description="Description text..."
  backgroundColor="#6bdbff"
/>
```

#### InfoGrid
Grid layout for key information points.
```tsx
<InfoGrid
  title="Key Concepts"
  items={[
    { icon: "📍", title: "Point 1", description: "Description..." },
    { icon: "⚡", title: "Point 2", description: "Description..." }
  ]}
  backgroundColor="#f2e356"
/>
```

#### SectionCard
Cards for major concepts (like "Big Three" or planetary lines).
```tsx
<SectionCard
  icon="☉"
  title="Sun Sign"
  subtitle="Core Identity"
  description="Your core identity and ego..."
  keyQuestions={["Question 1?", "Question 2?"]}
  backgroundColor="#f2e356"
  className="border-r border-black"
/>
```

#### IntegrationCard
For combination/synthesis sections.
```tsx
<IntegrationCard
  title="How They Work Together"
  description="Understanding the interplay..."
  exampleText="Example integration text..."
>
  {/* Custom content */}
</IntegrationCard>
```

#### AssessmentExercise
Step-by-step interactive exercises.
```tsx
<AssessmentExercise
  title="Quick Assessment"
  description="Reflect on your learning..."
  items={[
    { number: 1, title: "Step 1", description: "Do this..." },
    { number: 2, title: "Step 2", description: "Then this..." }
  ]}
/>
```

#### VisualChart
Chart diagrams with labels.
```tsx
<VisualChart
  title="Chart Structure"
  description="Visual explanation..."
  points={[
    { position: "top-6 left-1/2", label: "MC", description: "Career" }
  ]}
/>
```

#### SymbolGrid
Planetary symbols and meanings.
```tsx
<SymbolGrid
  title="Planet Symbols"
  subtitle="Personal planets"
  items={[
    { symbol: "☉", name: "Sun", description: "Core identity" }
  ]}
  backgroundColor="#ff91e9"
/>
```

#### NextSteps
Numbered action steps.
```tsx
<NextSteps
  title="Your Next Steps"
  description="Continue your journey..."
  steps={[
    { number: 1, title: "Step", description: "Description..." }
  ]}
/>
```

## Creating a New Guide

### 1. Create Guide Directory
```bash
mkdir src/app/guides/[guide-name]
```

### 2. Create page.tsx
```tsx
"use client";

import React from 'react';
import GuideTemplate from '@/components/guides/GuideTemplate';
import { renderGuideContent } from './content'; // For large guides

export default function MyGuidePage() {
  const guide = {
    id: 'my-guide',
    title: 'My Guide Title',
    description: 'Guide description for SEO and header',
    level: 'beginner' | 'intermediate' | 'advanced',
    estimatedTime: '30 min',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        type: 'text',
        content: ''
      }
      // Add more sections...
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    // Return JSX for each section
    switch (currentSection) {
      case 0:
        return <HeroCard icon="🎯" title="..." description="..." />;
      default:
        return <div>Content not found</div>;
    }
  };

  const quickActions = {
    primary: {
      title: "Primary Action",
      description: "Description...",
      href: "/target-page", 
      linkText: "Action Text",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Secondary Action", 
      description: "Description...",
      href: "/discussions",
      linkText: "Join Discussion",
      backgroundColor: "#f2e356"
    }
  };

  return (
    <GuideTemplate 
      guide={guide}
      renderSectionContent={renderSectionContent}
      quickActions={quickActions}
    />
  );
}
```

### 3. Create content.tsx (for large guides)
For guides with extensive content, split into separate content file:

```tsx
import React from 'react';
import { HeroCard, InfoGrid, /* other components */ } from '@/components/guides/GuideComponents';

export const renderGuideContent = (currentSection: number) => {
  switch (currentSection) {
    case 0:
      return (
        <div className="space-y-8">
          <HeroCard icon="🎯" title="..." description="..." />
          {/* More components */}
        </div>
      );
    // More cases...
    default:
      return <div>Section not found</div>;
  }
};
```

## Design System

### Colors (Synapsas Palette)
- **Blue**: `#6bdbff` - Primary actions, hero sections
- **Yellow**: `#f2e356` - Information, secondary actions  
- **Green**: `#51bd94` - Success, progress, nature themes
- **Purple**: `#ff91e9` - Creativity, spirituality
- **Light Purple**: `#f0e3ff` - Advanced level indicator

### Typography
- **Headers**: `font-space-grotesk` (headings, titles)
- **Body**: `font-inter` (paragraphs, descriptions)

### Layout Principles
- **Sharp Edges**: No rounded corners (`border-radius: 0`)
- **Black Borders**: `border-black` throughout
- **Grid Partitions**: Connected sections, not floating cards
- **Full-Width Breakout**: Edge-to-edge layout on guide pages

## Best Practices

### Content Structure
1. **Start with HeroCard** - Clear introduction to the section
2. **Use InfoGrid** - For key concepts or bullet points
3. **SectionCard grids** - For comparing related concepts
4. **IntegrationCard** - For synthesis and examples
5. **Assessment/NextSteps** - For actionable conclusions

### Accessibility
- All components include proper ARIA labels
- Color contrast meets WCAG guidelines
- Keyboard navigation supported
- Screen reader friendly

### Performance
- Components are optimized with React.memo where needed
- Large content split into separate files
- Template provides efficient state management

## Examples

See existing guides:
- **Natal Chart**: `/src/app/guides/natal-chart/` - Comprehensive beginner guide
- **Astrocartography**: `/src/app/guides/astrocartography/` - Intermediate guide with maps

## Future Enhancements

Planned improvements:
- Interactive exercises with form validation
- Progress persistence across sessions  
- Social sharing for completed guides
- Advanced animations and transitions
- Multi-language support