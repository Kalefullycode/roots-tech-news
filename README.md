# RootsTechNews - Performance Optimized Tech News Platform

## 🚀 Performance Metrics
- **LCP**: < 2.5s (Large Contentful Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Lighthouse Score**: ≥ 90 across all categories

## 🔧 Environment Setup

### Required Environment Variables
Create a `.env.local` file in the root directory:

```bash
# RSS News API (Optional - fallback content available)
VITE_NEWS_API_KEY=your-rss2json-api-key

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXX
```

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📝 Content Management

### Adding New Articles
Create MDX files in `src/content/articles/` with this frontmatter:

```yaml
---
title: "Your Article Title"
slug: "url-friendly-slug"
excerpt: "Brief description for SEO and cards"
date: "2025-08-31T21:47:00Z"
author: "Author Name"
category: "AI | Startups | Culture | Gadgets | Security"
tags: ["tag1", "tag2"]
heroImage: "/images/article-image.jpg"
featured: true|false
---
```

### Image Optimization
- Use WebP format when possible
- Include descriptive alt text for accessibility
- Optimize for responsive loading
- Store in `public/images/` directory

## ✨ Design System Lock

### 🔒 **CRITICAL: Do Not Modify Visual Design**
This site maintains pixel-perfect fidelity to the original design. When making changes:

1. **Typography**: Use only Orbitron (headlines) and Roboto (body)
2. **Colors**: Reference design tokens in `tailwind.config.ts`
3. **Spacing**: Maintain exact padding/margins (±4px tolerance)
4. **Corner Radii**: Keep `rounded-xl` for cards and banners
5. **Glow Effects**: Use design system glow utilities only

### Design Token Reference
```css
/* Primary Colors */
--electric-purple: #8A2BE2
--emerald-green: #50C878
--chrome-gold: #FFD700
--neon-blue: #1F51FF
--cyber-pink: #FF69B4
```

## ♿ Accessibility Features
- Semantic HTML landmarks
- ARIA labels and descriptions
- Keyboard navigation support
- Focus ring indicators
- AA+ color contrast ratios
- Screen reader optimizations

## 🔍 SEO Implementation
- Open Graph meta tags
- Twitter Card support
- JSON-LD structured data
- Canonical URLs
- Optimized meta descriptions
- Semantic heading hierarchy

## 🏗️ Architecture
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with design tokens
- **Components**: shadcn/ui + custom components
- **Icons**: Lucide React
- **Content**: MDX with frontmatter
- **State**: React Query for news fetching

## 📱 Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔄 Content Updates
To maintain design integrity while updating content:

1. **Text Changes**: Edit MDX files directly
2. **New Categories**: Add to category arrays in components
3. **Images**: Follow naming conventions and include alt text
4. **Breaking News**: Update `BreakingNewsBanner.tsx`

## 🚫 What NOT to Change
- Font families or weights
- Color values outside design tokens  
- Card dimensions or corner radii
- Header/footer layout structure
- Glow effect intensities
- Spacing between major sections

## 📊 Analytics Integration
Includes Google Analytics 4 setup and performance monitoring for Core Web Vitals tracking.

## 🌐 Deployment
Optimized for Vercel deployment with automatic performance optimization and CDN integration.