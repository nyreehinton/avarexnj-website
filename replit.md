# AvarexNJ Official Website - Replit Configuration

## Project Overview

This is the official website for AvarexNJ, a New Jersey hip-hop artist. The website showcases music, videos, photo gallery, and booking information.

**Project Type:** Static Single-Page Application (SPA)  
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript  
**Deployment:** Static site hosting

## Recent Changes

### November 27, 2025 - Replit Environment Setup
- Configured Node.js environment
- Set up development workflow to serve on port 5000
- Configured static deployment settings
- Verified website functionality in Replit environment

## Project Architecture

### Core Structure
- **Single HTML file architecture** (`index.html` - ~4,535 lines)
  - Embedded CSS styles
  - Hero animation with morphing sketch-to-text effect (~1,700 lines of animation code)
  - All page sections in one file
- **External JavaScript:** `assets/js/media-integration.js` - handles audio/video players and gallery
- **Media Assets:** `assets/media/` directory containing:
  - Optimized audio files (128kbps MP3)
  - Optimized images (WebP + JPG fallbacks)
  - Video files for AvarexTV section

### Key Features
1. **Morphing Hero Animation** - SVG sketch that morphs into text (10-second animation sequence)
2. **Audio Player Integration** - Embedded music player with streaming platform links
3. **Video Gallery (AvarexTV)** - Video content with category filtering
4. **Photo Gallery** - Lightbox-enabled gallery with lazy loading
5. **Booking/Contact Forms** - Professional booking and contact forms
6. **Social Media Integration** - Links to all platforms

### Build System
- **No build tools** - This is intentional for maximum simplicity
- Uses `serve` package for local development
- Direct browser compatibility with no transpilation

## Development

### Running Locally
The website runs automatically via the "Start Website" workflow on port 5000.

To manually start:
```bash
npm start
```

### Making Changes
1. **Content/Styles:** Edit `index.html` (contains all HTML, CSS, and hero animation)
2. **Interactive Features:** Edit `assets/js/media-integration.js` (audio/video/gallery logic)
3. **Media Files:** Add to `assets/media/` and run optimization scripts if needed

### File Organization
- All paths are relative to root (no leading slash)
- Example: `src="assets/media/images/optimized/photo.jpg"`

## Deployment

### Configuration
- **Type:** Static site deployment
- **Public Directory:** Root (`.`)
- **No build step required**

### Publishing
The site is configured for static hosting. When you're ready to publish, click the "Deploy" button in Replit.

## User Preferences

### Coding Conventions
- Pure vanilla JavaScript (ES6+) - no frameworks
- CSS custom properties (CSS variables) for all reusable values
- Mobile-first responsive design
- Accessibility-first approach (ARIA labels, keyboard navigation, reduced motion support)

### Important Notes
1. **Do NOT introduce build tools** - The single-file architecture is intentional
2. **Always use CSS variables** from `:root` instead of hardcoded values
3. **Test responsively** - Mobile, tablet, and desktop viewports
4. **Optimize media** before committing large files

## Key Sections

### Hero Section
- Complex SVG animation with four phases: Emergence → Morphing → Formation → Stabilization
- Performance-optimized with `requestAnimationFrame`
- Respects `prefers-reduced-motion` for accessibility
- See `Features.md` for detailed animation blueprint

### Music Section
- Audio player integration with multiple tracks
- Streaming platform links (Spotify, Apple Music, YouTube Music)
- Album artwork and descriptions

### AvarexTV (Videos)
- Video gallery with category filtering
- Embedded video players
- Responsive grid layout

### Photo Gallery
- Lightbox functionality
- Lazy loading for performance
- WebP with JPG fallbacks

### Forms
- Booking form (`/submit-booking` endpoint)
- Contact form (`/submit-contact` endpoint)

## Performance Considerations

- Hero animation targets 60fps
- Images use lazy loading
- WebP format with JPG fallbacks
- Audio files compressed to 128kbps
- Videos served directly (consider external hosting for high traffic)

## Browser Compatibility

Tested and working in:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels throughout
- Keyboard navigation support
- Focus indicators
- Reduced motion support
- Alt text on all images
- WCAG AA color contrast compliance

## Resources

- **README.md** - User-facing project documentation
- **CLAUDE.md** - Comprehensive AI assistant guide with coding conventions
- **Features.md** - Hero animation blueprint and specifications
- **netlify.toml** - Original Netlify deployment configuration (reference only)
