# Blog UI Documentation

## Overview
This document provides comprehensive documentation for the blog system UI implementation in Luckstrology, featuring a modern carousel-based design with Synapsas aesthetic principles, animated zodiac cards, and responsive layouts.

## Table of Contents
- [Page Structure](#page-structure)
- [Featured Articles Carousel](#featured-articles-carousel)
- [Blog Post Cards](#blog-post-cards)
- [Animated Zodiac Cards](#animated-zodiac-cards)
- [Mock Data System](#mock-data-system)
- [Responsive Design](#responsive-design)
- [Technical Implementation](#technical-implementation)
- [Styling Guidelines](#styling-guidelines)

---

## Page Structure

### Layout Architecture
```tsx
// Full-width page breakout with section-based design
<div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
  <div className="min-h-screen bg-white">
    <section className="px-[5%] py-12">        // Hero Section
    <section className="px-[5%] py-12">        // Featured Articles Carousel
    <section className="px-[5%] py-12">        // Main Content Grid
  </div>
</div>
```

**Design Principles:**
- **Full-width breakout**: Escapes container constraints for maximum visual impact
- **Section-based flow**: Each section manages its own spacing independently
- **Consistent padding**: `px-[5%]` matches Synapsas global padding pattern
- **White background**: Clean, minimal aesthetic throughout

---

## Featured Articles Carousel

### Auto-Scrolling Carousel System
The featured articles section includes a sophisticated auto-scrolling carousel with manual navigation controls.

#### Core Features
```tsx
// Auto-scroll every 5 seconds
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentFeaturedIndex(prev => 
      prev === featuredPosts.length - 1 ? 0 : prev + 1
    );
  }, 5000);
  return () => clearInterval(interval);
}, [featuredPosts.length]);
```

**Carousel Characteristics:**
- **Auto-advance**: 5-second intervals between slides
- **Infinite loop**: Returns to first slide after last slide
- **Smooth transitions**: CSS-based transform animations
- **User interaction handling**: Pauses auto-scroll on manual navigation

### Synapsas-Style Pagination

#### Sharp Geometric Pagination Boxes
```tsx
// Numbered pagination boxes instead of dots
<div className="flex items-center gap-1">
  {featuredPosts.map((_, index) => (
    <button
      className={`w-6 h-6 border-2 border-black transition-all duration-300 font-space-grotesk font-semibold text-xs ${
        index === currentFeaturedIndex
          ? 'bg-black text-white'                    // Active state
          : 'bg-white text-black hover:bg-black hover:text-white'  // Inactive state
      }`}
    >
      {index + 1}
    </button>
  ))}
</div>
```

**Pagination Features:**
- **Numbered boxes**: Shows page numbers (1, 2, 3) for clarity
- **Sharp edges**: No rounded corners, geometric aesthetic
- **High contrast**: Black/white color inversion
- **Space Grotesk typography**: Consistent with Synapsas font hierarchy
- **Hover transitions**: Smooth color inversion on hover

#### Progress Indicator
```tsx
// Sharp progress bar with black styling
<div className="mt-6 w-full bg-gray-200 border border-black h-2 overflow-hidden">
  <div 
    className="h-full bg-black transition-all duration-300 ease-out"
    style={{ width: `${((currentFeaturedIndex + 1) / featuredPosts.length) * 100}%` }}
  />
</div>
```

**Progress Bar Design:**
- **Sharp rectangular shape**: No rounded corners
- **Black border**: `border border-black` for definition
- **Black fill**: Consistent with Synapsas color system
- **Smooth animation**: Transitions as carousel advances

### Carousel Container Structure
```tsx
// Horizontal scrolling container with transform animations
<div className="relative overflow-hidden">
  <div
    className="flex transition-transform duration-500 ease-in-out"
    style={{ transform: `translateX(-${currentFeaturedIndex * 100}%)` }}
  >
    {featuredPosts.map((post) => (
      <div key={post.id} className="w-full flex-shrink-0">
        <FeaturedPostCard post={post} />
      </div>
    ))}
  </div>
</div>
```

**Container Features:**
- **CSS transforms**: Hardware-accelerated animations
- **Flex layout**: Side-by-side card arrangement
- **Overflow hidden**: Masks off-screen cards
- **Full-width cards**: Each card takes full container width

---

## Blog Post Cards

### FeaturedPostCard Component

#### Large Format Design
```tsx
// Two-column layout for featured posts
<div className="grid md:grid-cols-2 gap-0">
  <Link href={`/blog/${post.slug}`}>          // Image section
    {post.imageUrl ? (
      <Image src={post.imageUrl} alt={post.title} fill />
    ) : (
      <AnimatedZodiacCard category={post.category} />
    )}
  </Link>
  <div className="p-8">                       // Content section
    {/* Post content */}
  </div>
</div>
```

**Featured Card Characteristics:**
- **Two-column grid**: Image and content side-by-side
- **Large typography**: `text-2xl md:text-3xl` for hero-level impact
- **Generous padding**: `p-8` for premium feel
- **Featured badge**: Yellow badge with star icon
- **Rich metadata**: Date, read time, view count, author information

#### Featured Badge System
```tsx
// Distinctive featured post indicator
<div className="absolute top-4 left-4 z-10 bg-yellow-400 border border-black px-3 py-1 flex items-center">
  <Star className="w-4 h-4 mr-1 fill-black" />
  <span className="text-sm font-bold uppercase">Featured</span>
</div>
```

### BlogPostCard Component

#### Standard Grid Format
```tsx
// Compact card layout for post grid
<article className="bg-white border border-black rounded-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
  <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
    {/* Image or AnimatedZodiacCard */}
  </Link>
  <div className="p-6">
    {/* Compact content layout */}
  </div>
</article>
```

**Standard Card Features:**
- **Square aspect ratio**: `h-48` image section
- **Compact padding**: `p-6` for efficient space usage
- **Border styling**: `border border-black` for definition
- **Hover effects**: Subtle shadow on hover
- **Responsive typography**: Scales appropriately on mobile

### Common Card Elements

#### Author Information
```tsx
<div className="flex items-center">
  <Image
    src={post.authorAvatar}
    alt={post.author}
    width={40}
    height={40}
    className="rounded-full mr-3"
  />
  <div>
    <span className="text-sm font-medium text-gray-700">{post.author}</span>
    <span className="text-xs text-gray-500">Author</span>
  </div>
</div>
```

#### Metadata Display
```tsx
<div className="flex items-center gap-4 text-sm text-gray-500">
  <span className="flex items-center">
    <Calendar className="w-4 h-4 mr-1" />
    {formattedDate}
  </span>
  <span className="flex items-center">
    <Clock className="w-4 h-4 mr-1" />
    {post.readTime} min read
  </span>
  <span className="flex items-center">
    <Eye className="w-4 h-4 mr-1" />
    {post.viewCount.toLocaleString()} views
  </span>
</div>
```

#### Tag System
```tsx
<div className="flex flex-wrap gap-2">
  {post.tags.map((tag) => (
    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300">
      <Tag className="w-3 h-3 mr-1" />
      {tag}
    </span>
  ))}
</div>
```

---

## Animated Zodiac Cards

### Fallback Visual System
When blog posts don't have images, the system automatically displays animated zodiac cards that match the post's category.

#### Component Structure
```tsx
<AnimatedZodiacCard 
  category={post.category}
  className="w-full h-full"
  showParticles={true}
/>
```

### Category-Based Theming

#### Color Mapping System
```tsx
const getZodiacForCategory = (category: string): string => {
  const categoryMap = {
    'Beginner Guides': 'aries',
    'Planetary Movements': 'leo',
    'Chart Interpretation': 'virgo',
    'Planetary Insights': 'scorpio',
    'Lunar Astrology': 'cancer',
    'Relationship Astrology': 'libra',
    'General': 'gemini'
  };
  return categoryMap[category] || 'gemini';
};
```

#### Gradient Generation
```tsx
const getGradientForCategory = (category: string): string => {
  // Consistent gradient based on category hash
  const hash = category.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return gradients[Math.abs(hash) % gradients.length];
};
```

**Available Gradients:**
- `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - Purple/Blue
- `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` - Pink/Red
- `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` - Blue/Cyan
- `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)` - Green/Teal
- `linear-gradient(135deg, #fa709a 0%, #fee140 100%)` - Pink/Yellow
- Plus 7 additional gradient variations

### Animation Features

#### Orbital Elements
```tsx
// Animated orbital path with rotating elements
<svg viewBox="0 0 160 160">
  <circle cx="80" cy="80" r="50" stroke="rgba(255,255,255,0.3)" strokeDasharray="2,4" />
  <path fill="rgba(255,255,255,0.6)">
    <animateTransform 
      attributeName="transform" 
      type="rotate" 
      from="360 0 0" 
      to="0 0 0" 
      dur="8s"
      repeatCount="indefinite" 
    />
  </path>
</svg>
```

#### Floating Particles
```tsx
// Animated particle system
{[...Array(6)].map((_, i) => (
  <div
    className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
    style={{
      left: `${20 + (i * 15)}%`,
      top: `${30 + (i * 8)}%`,
      animationDelay: `${i * 0.5}s`,
      animationDuration: `${2 + (i * 0.3)}s`
    }}
  />
))}
```

#### Central Moon Icon
```tsx
// Stylized moon with crater details
<div className="absolute inset-0 flex items-center justify-center">
  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
    <svg className="w-8 h-8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="white" />
      {/* Crater details */}
    </svg>
  </div>
</div>
```

---

## Mock Data System

### Blog Post Generation
The blog system uses a sophisticated mock data generator that creates realistic blog content for development and testing.

#### Data Structure
```tsx
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  viewCount: number;
  imageUrl?: string;        // Optional - triggers AnimatedZodiacCard when undefined
  isFeatured: boolean;
  slug: string;
}
```

#### Mock Data Generation
```tsx
const generateMockPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  const categories = ['Beginner Guides', 'Planetary Movements', 'Chart Interpretation', /* ... */];
  const authors = [
    { name: 'Luna Starweaver', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna' },
    { name: 'Cosmic Oracle', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cosmic' },
    // Additional authors...
  ];

  for (let i = 1; i <= 50; i++) {
    // Generate realistic blog post data
    posts.push({
      id: i.toString(),
      title: titleTemplate.replace('{category}', category.name),
      excerpt: `Discover the profound influence of ${category.name.toLowerCase()}...`,
      // No imageUrl property - triggers AnimatedZodiacCard
      isFeatured: i <= 3,  // First 3 posts are featured
      // Additional properties...
    });
  }
  return posts;
};
```

**Mock Data Features:**
- **50 generated posts**: Provides substantial content for testing
- **Realistic metadata**: Random but believable read times, view counts, dates
- **Category distribution**: Even spread across astrology categories
- **Featured post selection**: First 3 posts marked as featured
- **Author variety**: 4 different mock authors with generated avatars
- **Tag associations**: Relevant tags for each category

### Image Fallback Strategy
```tsx
// Removed imageUrl from mock data to trigger AnimatedZodiacCard
// OLD: imageUrl: `/images/blog/placeholder-${(i % 8) + 1}.jpg`,
// NEW: No imageUrl property - undefined triggers zodiac card fallback
```

---

## Responsive Design

### Mobile-First Approach

#### Breakpoint Strategy
```css
/* Grid adaptations */
.grid-cols-1 md:grid-cols-2      /* Mobile: 1 column, Tablet+: 2 columns */
.grid-cols-1 lg:grid-cols-12     /* Mobile: 1 column, Desktop: 12-column grid */

/* Typography scaling */
.text-4xl md:text-5xl            /* Mobile: 4xl, Desktop: 5xl */
.text-2xl md:text-3xl            /* Mobile: 2xl, Desktop: 3xl */
```

#### Mobile Carousel Behavior
```tsx
// Touch-friendly pagination on mobile
<button className="w-6 h-6 border-2 border-black font-semibold text-xs">
  {index + 1}
</button>
```

#### Content Adaptations
```tsx
// Responsive padding adjustments
className="p-4 md:p-6 lg:p-8"        // Scales with screen size
className="px-[5%] py-12"            // Consistent global padding
className="max-w-7xl mx-auto"        // Centered content container
```

### Layout Adaptations

#### Featured Posts Grid
```tsx
// Responsive featured post layout
<div className="grid md:grid-cols-2 gap-0">
  <div className="h-64 md:h-full">    // Mobile: fixed height, Desktop: full height
    {/* Image section */}
  </div>
  <div className="p-8">
    {/* Content section */}
  </div>
</div>
```

#### Main Content Grid
```tsx
// Sidebar layout adaptation
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div className="lg:col-span-8">     // Main content
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Blog post cards */}
    </div>
  </div>
  <aside className="lg:col-span-4">   // Sidebar
    {/* Sidebar content */}
  </aside>
</div>
```

---

## Technical Implementation

### State Management

#### Carousel State
```tsx
// Featured posts carousel state
const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
const carouselRef = useRef<HTMLDivElement>(null);
const autoScrollRef = useRef<NodeJS.Timeout>();
```

#### Auto-Scroll Logic
```tsx
// Auto-scroll with user interaction handling
useEffect(() => {
  if (featuredPosts.length <= 1) return;

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setCurrentFeaturedIndex(prevIndex => 
        prevIndex === featuredPosts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  };

  startAutoScroll();
  return () => clearInterval(autoScrollRef.current);
}, [featuredPosts.length]);
```

#### Manual Navigation
```tsx
// Reset auto-scroll on manual interaction
const goToFeaturedPost = (index: number) => {
  setCurrentFeaturedIndex(index);
  
  // Clear current timer
  if (autoScrollRef.current) {
    clearInterval(autoScrollRef.current);
  }
  
  // Restart after 10 seconds of inactivity
  setTimeout(() => {
    // Resume auto-scroll...
  }, 10000);
};
```

### Performance Optimizations

#### Efficient Rendering
```tsx
// Conditional rendering for better performance
{featuredPosts.length > 0 && !filters.category && !filters.searchQuery && (
  <FeaturedCarouselSection />
)}
```

#### Hardware Acceleration
```tsx
// CSS transform animations for smooth performance
style={{ transform: `translateX(-${currentFeaturedIndex * 100}%)` }}
className="transition-transform duration-500 ease-in-out"
```

#### Image Optimization
```tsx
// Next.js Image optimization with fallback
{post.imageUrl ? (
  <Image
    src={post.imageUrl}
    alt={post.title}
    fill
    className="object-cover hover:scale-105 transition-transform duration-300"
  />
) : (
  <AnimatedZodiacCard category={post.category} />
)}
```

---

## Styling Guidelines

### Synapsas Design Principles

#### Typography Hierarchy
```tsx
// Main page title
<h1 className="text-4xl md:text-5xl font-bold text-gray-900">

// Section headers  
<h2 className="text-2xl font-bold text-gray-900">

// Card titles
<h3 className="text-xl font-semibold text-gray-900">

// Body text
<p className="text-gray-600 leading-relaxed">
```

#### Color System
```css
/* Primary colors */
--text-primary: #111827;        /* Gray-900 */
--text-secondary: #6b7280;      /* Gray-500 */
--border-primary: #000000;      /* Black borders */
--background-primary: #ffffff;   /* White backgrounds */

/* Accent colors for badges */
--accent-yellow: #fbbf24;       /* Featured badges */
--accent-gray: #f3f4f6;         /* Tag backgrounds */
```

#### Spacing System
```css
/* Consistent spacing scale */
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */

/* Section padding */
--section-padding: 5%;    /* Horizontal padding for sections */
```

#### Border and Shadow System
```css
/* Border weights */
.border-light { border-width: 1px; }
.border-heavy { border-width: 2px; }

/* Shadow hierarchy */
.shadow-subtle { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.shadow-medium { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-strong { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
```

### Component-Specific Styles

#### Featured Post Styling
```css
.featured-post {
  /* Large format with premium spacing */
  padding: 2rem;
  font-size: 1.25rem;
  line-height: 1.6;
}

.featured-badge {
  background-color: #fbbf24;  /* Yellow accent */
  border: 1px solid black;
  font-weight: 700;
  text-transform: uppercase;
}
```

#### Standard Post Styling  
```css
.blog-post-card {
  /* Compact format for grid layout */
  padding: 1.5rem;
  border: 1px solid black;
  transition: box-shadow 0.3s ease;
}

.blog-post-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

#### Pagination Styling
```css
.pagination-box {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid black;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.pagination-box.active {
  background-color: black;
  color: white;
}

.pagination-box:hover {
  background-color: black;
  color: white;
}
```

---

## File Structure

### Core Blog Files
```
src/
├── app/blog/
│   └── page.tsx                    # Main blog page (simplified with hooks)
├── components/blog/
│   ├── AnimatedZodiacCard.tsx      # Animated fallback graphics
│   ├── BlogPostCard.tsx            # Standard blog post cards
│   ├── FeaturedPostCard.tsx        # Large format featured cards
│   ├── BlogSidebar.tsx             # Sidebar with categories/popular posts
│   ├── BlogPagination.tsx          # Pagination controls
│   └── BlogSEO.tsx                 # SEO meta management
├── hooks/
│   ├── useBlogData.ts              # Blog data management & filtering
│   └── useCarousel.ts              # Carousel auto-scroll functionality
├── utils/
│   └── blogUtils.ts                # Blog utility functions
├── types/
│   └── blog.ts                     # TypeScript interfaces
└── constants/
    └── blog.ts                     # Blog categories and configuration
```

### Related Documentation
- `/synapsas.md` - Synapsas design system guidelines
- `/CLAUDE.md` - Development guidelines and commands
- `/BLOG_UI_DOCUMENTATION.md` - This document

---

## Usage Examples

### Implementing New Blog Features

#### Adding a New Category
```tsx
// In constants/blog.ts
export const BLOG_CATEGORIES = [
  // Existing categories...
  { id: 'new-category', name: 'New Category', color: '#6bdbff' }
];

// In AnimatedZodiacCard.tsx
const categoryMap = {
  // Existing mappings...
  'New Category': 'capricorn'  // Map to zodiac sign
};
```

#### Customizing Carousel Timing
```tsx
// Adjust auto-scroll interval
const AUTO_SCROLL_INTERVAL = 7000;  // 7 seconds instead of 5

// Adjust manual interaction pause
const MANUAL_PAUSE_DURATION = 15000;  // 15 seconds instead of 10
```

#### Adding New Author
```tsx
// In useBlogPosts.ts mock data
const authors = [
  // Existing authors...
  { 
    name: 'New Author', 
    id: '5', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewAuthor' 
  }
];
```

---

## Future Enhancements

### Planned Features
1. **Blog Post Detail Pages**: Individual blog post view with full content
2. **Search Functionality**: Filter posts by title, content, or tags
3. **Category Pages**: Dedicated pages for each blog category
4. **Related Posts**: Sidebar showing related content
5. **Reading Progress**: Progress indicator for long-form content
6. **Social Sharing**: Share buttons with proper meta tags

### Technical Improvements
1. **Real API Integration**: Replace mock data with actual blog CMS
2. **Image Optimization**: WebP format support and responsive images
3. **Infinite Scroll**: Load more posts as user scrolls
4. **Keyboard Navigation**: Arrow key support for carousel
5. **Accessibility Enhancements**: ARIA labels and screen reader support

### Performance Optimizations
1. **Lazy Loading**: Load images and content as needed
2. **Content Caching**: Cache popular posts for faster loading
3. **Bundle Splitting**: Separate blog code from main application
4. **Service Worker**: Offline reading capability

---

This documentation provides a comprehensive guide to the blog UI system, covering all major components, interactions, and styling patterns. The system successfully combines modern carousel functionality with the clean Synapsas aesthetic, creating an engaging and professional blog experience.