# CLAUDE.md - AI Assistant Guide for AvarexNJ Website

This document provides comprehensive guidance for AI assistants working on the AvarexNJ official website codebase.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design Philosophy](#architecture--design-philosophy)
3. [Codebase Structure](#codebase-structure)
4. [Key Conventions](#key-conventions)
5. [Development Workflow](#development-workflow)
6. [Making Changes](#making-changes)
7. [Common Tasks](#common-tasks)
8. [Testing & Validation](#testing--validation)
9. [Deployment](#deployment)
10. [Gotchas & Important Notes](#gotchas--important-notes)

---

## Project Overview

**Project Name:** AvarexNJ Official Website
**Type:** Static Single-Page Application (SPA)
**Purpose:** Artist portfolio website for New Jersey hip-hop artist AvarexNJ
**Deployment:** Netlify (continuous deployment from `main` branch)
**Tech Stack:** Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)

### Key Features
- Morphing sketch-to-text hero animation (~1,700 lines of animation code)
- Audio player with streaming integration
- Video gallery (AvarexTV)
- Photo gallery with lightbox
- Booking and contact forms
- Career highlights/portfolio section
- Social media integration

---

## Architecture & Design Philosophy

### No-Build Philosophy
This project intentionally uses **no build tools, bundlers, or transpilers**. The approach is:
- ✅ Single HTML file with embedded CSS and scripts
- ✅ Vanilla JavaScript (ES6+)
- ✅ Direct browser compatibility
- ✅ Simple development server (`serve`)
- ❌ No webpack, Vite, or other bundlers
- ❌ No TypeScript, JSX, or compilation
- ❌ No CSS preprocessors (Sass/Less)

**Rationale:** Maximum simplicity, instant deployment, zero build complexity.

### Single-File Architecture
The main `index.html` file (~4,535 lines) contains:
- Complete HTML structure
- Embedded CSS in `<style>` tags
- Embedded hero animation JavaScript
- External script reference to `assets/js/media-integration.js`

**When to keep code in index.html:**
- Hero animation logic (already there)
- Page-specific styles and layout
- Critical path code

**When to use separate files:**
- Reusable interactive components (`media-integration.js`)
- Large utility scripts
- Future modular features

---

## Codebase Structure

```
/home/user/avarexnj-website/
├── index.html                          # Main website (4,535 lines)
│   ├── <head>                          # Meta tags, SEO, structured data
│   ├── <style>                         # CSS variables and all styles
│   ├── <body>
│   │   ├── Header/Navigation           # Sticky nav with logo
│   │   ├── Hero Section                # SVG animation (~2700-2840)
│   │   ├── Latest Release              # Featured album
│   │   ├── News & Updates              # Artist announcements
│   │   ├── Music Section               # Audio players & tracks
│   │   ├── AvarexTV (Videos)           # Video gallery with filters
│   │   ├── Photo Gallery               # Lightbox with lazy loading
│   │   ├── Career Highlights           # Portfolio section
│   │   ├── Connect & Book              # Booking form
│   │   └── Contact Section             # Contact form
│   └── <script>                        # Hero animation code
│
├── assets/
│   ├── js/
│   │   └── media-integration.js        # Audio/video/gallery logic (225 lines)
│   └── media/
│       ├── audio/optimized/            # 10 MP3 files (128kbps)
│       ├── images/optimized/
│       │   ├── full/                   # Full-size images (1200px)
│       │   └── thumbnails/             # Thumbnails (300px)
│       ├── icons/optimized/            # Platform logos
│       ├── videos/                     # 6 video files (167MB)
│       └── original_backup/            # Backup of original media
│
├── optimize-images.sh                  # Image optimization script
├── optimize-media.sh                   # Audio optimization script
├── package.json                        # Dependencies (serve only)
├── netlify.toml                        # Netlify config
├── README.md                           # User-facing documentation
├── Features.md                         # Hero animation blueprint
└── .gitignore                          # Git ignore rules
```

### File Sizes
- `index.html`: ~4,535 lines
- `assets/js/media-integration.js`: 225 lines
- Total media: ~220MB (168 files)
- Optimized audio: 38MB (10 files)
- Optimized images: 15MB (147 files)
- Videos: 167MB (6 files)

---

## Key Conventions

### CSS Conventions

#### CSS Variables (`:root`)
All colors, typography, spacing, and transitions are defined as CSS custom properties:

```css
:root {
    /* Colors */
    --color-primary: #000000;
    --color-secondary: #333333;
    --color-text: #333333;
    --color-text-light: #999999;
    --color-accent: #d92122;
    --color-background: #ffffff;
    --color-card: #f9f9f9;

    /* Typography */
    --font-primary: 'Montserrat', sans-serif;
    --font-secondary: 'Open Sans', sans-serif;
    --font-size-base: 16px;
    --font-size-h1: 3rem;
    --font-size-h2: 2.5rem;

    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 3rem;
    --spacing-xl: 4rem;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

**When making style changes:**
1. Always check if a CSS variable exists for the property
2. Use CSS variables instead of hardcoded values
3. Add new variables to `:root` for reusable properties
4. Follow the naming pattern: `--{category}-{property}-{variant}`

#### Responsive Design
Mobile-first approach with breakpoints:
- Mobile: < 768px (default)
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Media query structure:**
```css
/* Mobile-first (default) */
.element {
    property: mobile-value;
}

/* Tablet and up */
@media (min-width: 768px) {
    .element {
        property: tablet-value;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .element {
        property: desktop-value;
    }
}
```

### JavaScript Conventions

#### Event Handling Pattern
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize code here
});
```

#### Element Selection
Use `querySelectorAll` for multiple elements, `querySelector` for single:
```javascript
const audioPlayers = document.querySelectorAll('.audio-player');
const heroSection = document.querySelector('#hero-section');
```

#### Preventing Multiple Playback
Pattern used for audio/video players:
```javascript
player.addEventListener('play', function() {
    allPlayers.forEach(otherPlayer => {
        if (otherPlayer !== player && !otherPlayer.paused) {
            otherPlayer.pause();
        }
    });
});
```

#### Accessibility Patterns
Always include:
- ARIA labels: `aria-label`, `aria-labelledby`
- Keyboard navigation support
- Focus management in modals/lightboxes
- Reduced motion support: `prefers-reduced-motion` media query

```javascript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    // Disable or simplify animations
}
```

### HTML Conventions

#### Semantic Structure
Use semantic HTML5 elements:
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- `<figure>` and `<figcaption>` for images
- `<audio>` and `<video>` for media

#### ID vs Class Naming
- **IDs**: Section identifiers for navigation (e.g., `#hero`, `#music`, `#videos`)
- **Classes**: Styling and JavaScript hooks (e.g., `.audio-player`, `.gallery-image`)

#### Class Naming Convention
Use descriptive, hyphenated lowercase:
- `.track-play-button`
- `.gallery-image`
- `.video-category-filter`
- `.hero-animation-container`

### Media Optimization Conventions

#### Image Formats
- **WebP** with **JPG fallback** for photos
- **PNG** for logos and icons
- Full-size: 1200px width, 85% quality
- Thumbnails: 300px width, 85% quality
- Icons: 95% quality

#### Audio Format
- MP3 format
- 128kbps bitrate
- 44.1kHz sample rate
- Stereo output

#### File Organization
- Optimized files: `assets/media/{type}/optimized/`
- Original backups: `assets/media/original_backup/{timestamp}/`

---

## Development Workflow

### Local Development

1. **Clone and Install:**
   ```bash
   git clone <repo-url>
   cd avarexnj-website
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```
   Opens on `http://localhost:3000`

3. **Making Changes:**
   - Edit `index.html` for structure, styles, or hero animation
   - Edit `assets/js/media-integration.js` for interactive features
   - Test locally before committing

### Git Workflow

**Branch Naming:**
- Features: `feature/{description}` or `feat/{description}`
- Fixes: `fix/{description}`
- Claude branches: `claude/{session-id}`

**Commit Messages:**
Follow existing style:
- Concise, descriptive messages
- Present tense (e.g., "Add feature" not "Added feature")
- Reference issue numbers when applicable

**Examples from history:**
- ✅ "Add morphing sketch-to-text hero animation"
- ✅ "Fix site display, alignment, and missing photos"
- ❌ "Updated stuff"
- ❌ "Changes"

**Typical Git Flow:**
```bash
# Check status
git status

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature description"

# Push to branch
git push -u origin feature/new-feature
```

### Media Optimization Workflow

**Optimizing Images:**
```bash
./optimize-images.sh
```
- Creates `optimized/full/` and `optimized/thumbnails/`
- Generates WebP and JPG formats
- Backs up originals to `original_backup/{timestamp}/`

**Optimizing Audio:**
```bash
./optimize-media.sh
```
- Compresses audio to 128kbps MP3
- Maintains 44.1kHz sample rate
- Backs up originals

**When to optimize:**
- After adding new images (photos, album art)
- After adding new audio tracks
- Before committing media changes

---

## Making Changes

### Adding New Content

#### Adding a New Album/Track
1. **Location:** `index.html` - Music Section (~line 2946)
2. **Steps:**
   - Add album artwork to `assets/media/images/optimized/`
   - Add audio file to `assets/media/audio/optimized/`
   - Add HTML structure following existing album pattern
   - Include streaming platform links (Spotify, Apple Music, YouTube Music)

#### Adding a New Video
1. **Location:** `index.html` - AvarexTV Section (~line 3121)
2. **Steps:**
   - Add video file to `assets/media/videos/`
   - Add video entry in HTML with category `data-category` attribute
   - Update category filters if adding new category
   - Include thumbnail preview

#### Adding Gallery Photos
1. **Location:** `index.html` - Photo Gallery Section (~line 3248)
2. **Steps:**
   - Add images to `assets/media/images/original/`
   - Run `./optimize-images.sh`
   - Add `<picture>` element with WebP and JPG sources
   - Include `data-src` for lazy loading
   - Add appropriate `alt` text for accessibility

### Modifying Styles

**Step-by-step process:**
1. **Locate the element** in `index.html` (note the class/ID)
2. **Find existing styles** in `<style>` section
3. **Check for CSS variables** in `:root` that apply
4. **Make changes** using existing variables when possible
5. **Test responsively** at mobile, tablet, and desktop sizes
6. **Check accessibility** (contrast, focus states)

**Example:**
```css
/* Before */
.button {
    background: #d92122;
    color: #ffffff;
}

/* After (using CSS variables) */
.button {
    background: var(--color-accent);
    color: var(--color-background);
    transition: var(--transition-normal);
}
```

### Modifying Hero Animation

**Location:** `index.html` - Embedded `<script>` at bottom

**Key Animation Phases:**
1. **Emergence** (0-2s): Lines emerge from bottom
2. **Morphing** (2-4s): Lines connect and form shapes
3. **Formation** (4-6s): Shapes solidify into text
4. **Stabilization** (6-10s): Text holds steady with idle animation

**Animation Constants:**
```javascript
const ANIMATION_CONFIG = {
    totalDuration: 10000,  // 10 seconds
    emergencePhase: 2000,
    morphingPhase: 2000,
    formationPhase: 2000,
    stabilizationPhase: 4000
};
```

**Performance Considerations:**
- Uses `requestAnimationFrame` for smooth 60fps
- Checks `prefers-reduced-motion` for accessibility
- Detects battery level for performance adjustment
- Mobile optimization (simplified animation)

**When modifying animation:**
1. Read `Features.md` for animation blueprint
2. Test on multiple devices (desktop, tablet, mobile)
3. Verify accessibility (reduced motion support)
4. Check performance (should maintain 60fps)

### Adding New Features

**Process:**
1. **Plan the feature** - understand scope and requirements
2. **Determine location:**
   - New section in `index.html`? (add to body structure)
   - New interactive behavior? (add to `media-integration.js`)
   - New styles? (add to `<style>` section)
3. **Follow existing patterns:**
   - Match HTML structure of similar sections
   - Use established CSS variables
   - Follow JavaScript event handling patterns
4. **Maintain accessibility:**
   - Semantic HTML
   - ARIA labels where needed
   - Keyboard navigation
   - Focus management
5. **Test thoroughly:**
   - Multiple browsers (Chrome, Safari, Firefox)
   - Multiple devices (mobile, tablet, desktop)
   - Accessibility tools
6. **Document if complex** (add comments or update this file)

---

## Common Tasks

### 1. Update Booking Form Action
**Location:** `index.html:~3526` (Connect & Book Section)
```html
<form action="/submit-booking" method="POST">
```
Change `action` attribute to new endpoint.

### 2. Update Contact Form Action
**Location:** `index.html:~3616` (Contact Section)
```html
<form action="/submit-contact" method="POST">
```
Change `action` attribute to new endpoint.

### 3. Update Social Media Links
**Location:** `index.html` - Multiple locations (header, footer, connect section)
Search for:
- `fa-instagram`
- `fa-twitter` / `fa-x-twitter`
- `fa-youtube`
- `fa-spotify`
- `fa-apple`

Update `href` attributes on parent `<a>` tags.

### 4. Update SEO Metadata
**Location:** `index.html:1-75` (Head section)
Update:
- `<title>` tag
- `<meta name="description">`
- `<meta name="keywords">`
- Open Graph tags (`og:*`)
- Twitter Card tags (`twitter:*`)
- Structured data JSON-LD

### 5. Add New Font
**Location:** `index.html:37` (Google Fonts link)
**Steps:**
1. Add font to Google Fonts link
2. Add CSS variable to `:root`
3. Apply variable to desired elements

### 6. Change Color Scheme
**Location:** `index.html` - CSS `:root` variables
**Steps:**
1. Update CSS variables in `:root`
2. Test all sections for contrast and readability
3. Verify WCAG AA compliance for accessibility

### 7. Fix Broken Links/Images
**Common causes:**
- Incorrect file paths
- Missing optimized versions
- Typos in filenames

**Search patterns:**
```bash
# Find all image references
grep -n "assets/media/images" index.html

# Find all audio references
grep -n "assets/media/audio" index.html

# Find all video references
grep -n "assets/media/videos" index.html
```

### 8. Update Copyright Year
**Location:** `index.html` - Footer section
Search for copyright symbol `©` and update year.

---

## Testing & Validation

### Pre-Commit Checklist
- [ ] Test locally with `npm start`
- [ ] Verify all links work (internal and external)
- [ ] Check media loads correctly (images, audio, video)
- [ ] Test forms (booking, contact)
- [ ] Validate HTML (use W3C validator if available)
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test accessibility (keyboard navigation, screen reader)
- [ ] Verify SEO metadata is correct

### Browser Testing
Test in:
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, Esc, Arrow keys)
- [ ] Focus indicators visible
- [ ] ARIA labels present and correct
- [ ] Alt text on all images
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Reduced motion preference respected

### Performance Testing
- [ ] Page loads in < 3 seconds (on 3G)
- [ ] Hero animation runs at 60fps
- [ ] Images lazy load correctly
- [ ] No console errors
- [ ] Lighthouse score > 90 (aim for)

### Responsive Testing Breakpoints
- Mobile: 375px (iPhone SE)
- Mobile: 414px (iPhone Plus)
- Tablet: 768px (iPad)
- Desktop: 1024px
- Desktop: 1440px
- Desktop: 1920px

---

## Deployment

### Netlify Configuration
**File:** `netlify.toml`
- Publishes entire root directory (`.`)
- Build command: `npm run build` (no-op)
- SPA fallback: All routes redirect to `index.html`
- Node version: 18

### Deployment Trigger
- **Automatic:** Any push to `main` branch triggers deployment
- **Manual:** Can trigger from Netlify dashboard

### Pre-Deployment Checklist
- [ ] All changes committed and pushed
- [ ] Branch merged to `main` (if on feature branch)
- [ ] Local testing complete
- [ ] No console errors
- [ ] Media files optimized
- [ ] Forms tested
- [ ] SEO metadata updated

### Post-Deployment Verification
1. Visit live site: `https://www.avarexnj.com` (or Netlify URL)
2. Check all pages/sections load
3. Test forms submission
4. Verify media plays correctly
5. Check responsive design
6. Test navigation and links
7. Monitor Netlify build logs for errors

### Rollback Procedure
If deployment fails or has issues:
1. Go to Netlify dashboard
2. Navigate to "Deploys" tab
3. Find previous successful deployment
4. Click "Publish deploy" to revert

---

## Gotchas & Important Notes

### Critical Constraints

#### 1. No Build Step
- ❌ **Do not** introduce build tools (webpack, Vite, etc.)
- ❌ **Do not** use TypeScript, JSX, or other compiled languages
- ❌ **Do not** use CSS preprocessors (Sass, Less, Stylus)
- ✅ **Keep** everything browser-native
- ✅ **Use** vanilla JavaScript (ES6+ is fine)

#### 2. Single HTML File Architecture
- **Most code lives in `index.html`** (~4,535 lines)
- This is intentional - do not split into multiple HTML files
- Only separate JavaScript goes in `assets/js/media-integration.js`
- Keep this pattern unless there's a compelling reason to change

#### 3. Hero Animation Complexity
- ~1,700 lines of animation code
- Performance-sensitive (60fps target)
- Accessibility-sensitive (reduced motion support)
- **Be very careful** when modifying
- **Always test** on multiple devices after changes
- **Read `Features.md`** before making animation changes

### Common Pitfalls

#### 1. File Paths
- All paths are relative to root
- Use `assets/media/...` not `/assets/media/...` (no leading slash)
- ✅ Correct: `src="assets/media/images/optimized/photo.jpg"`
- ❌ Wrong: `src="/assets/media/images/optimized/photo.jpg"`

#### 2. Media Optimization
- **Always optimize** before committing media files
- Run `./optimize-images.sh` for images
- Run `./optimize-media.sh` for audio
- **Don't commit** unoptimized originals to repo (unless backing up)

#### 3. CSS Specificity
- With single-file architecture, CSS can get complex
- **Always check** if a style is already defined
- **Use CSS variables** instead of hardcoding values
- **Be careful** with specificity wars (avoid `!important` when possible)

#### 4. Audio/Video Playback
- Browsers have different autoplay policies
- **Require user interaction** for audio/video playback
- **Don't assume** autoplay will work
- **Test** in all browsers

#### 5. Form Actions
- Forms point to `/submit-booking` and `/submit-contact`
- These are **backend endpoints** (not included in this repo)
- **Verify endpoints** are configured before deploying
- **Test form submission** in production

### Performance Notes

#### 1. Large HTML File
- `index.html` is 4,535 lines (~180KB uncompressed)
- This is acceptable for static site with no build step
- Netlify serves with gzip compression (~50KB compressed)
- **Don't worry** about file size unless it exceeds 200KB uncompressed

#### 2. Media Files
- Videos are large (167MB total)
- **Consider** using video hosting (YouTube, Vimeo) for large files
- **Current setup** serves directly from Netlify (acceptable for now)
- **Monitor bandwidth** if traffic increases

#### 3. Animation Performance
- Hero animation is GPU-intensive
- **Respects** `prefers-reduced-motion`
- **Simplifies** on mobile devices
- **Checks** battery level for performance tuning

### Accessibility Notes

#### 1. Keyboard Navigation
- All interactive elements must be keyboard-accessible
- **Tab order** should be logical
- **Focus indicators** must be visible
- **Escape key** should close modals/lightboxes

#### 2. Screen Readers
- Use **semantic HTML** (`<header>`, `<nav>`, `<main>`, etc.)
- Add **ARIA labels** where needed
- **Alt text** on all images
- **Form labels** properly associated

#### 3. Color Contrast
- Text contrast must meet **WCAG AA** (4.5:1 for normal text)
- Current color scheme: Black text (#333333) on white background (#ffffff) = 12.6:1 ✅
- **Test** any color changes with contrast checker

### SEO Notes

#### 1. Structured Data
- **JSON-LD** for MusicGroup schema (lines 46-73)
- **Keep updated** with new albums/releases
- **Validate** with Google Rich Results Test

#### 2. Meta Tags
- Open Graph for **Facebook** sharing
- Twitter Cards for **Twitter** sharing
- **Update** when content changes

#### 3. Performance = SEO
- Fast loading = better rankings
- **Optimize media** before committing
- **Test** with Lighthouse

---

## Resources

### External Documentation
- **HTML5:** https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS3:** https://developer.mozilla.org/en-US/docs/Web/CSS
- **JavaScript:** https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Web Accessibility:** https://www.w3.org/WAI/WCAG21/quickref/
- **Structured Data:** https://schema.org/MusicGroup

### Internal Documentation
- **README.md** - User-facing project documentation
- **Features.md** - Hero animation blueprint and specifications
- **package.json** - Dependencies and scripts
- **netlify.toml** - Deployment configuration

### Tools
- **Development Server:** `serve` package (npm start)
- **Image Optimization:** `optimize-images.sh` (uses ImageMagick)
- **Audio Optimization:** `optimize-media.sh` (uses FFmpeg)
- **Version Control:** Git + GitHub
- **Deployment:** Netlify

---

## Quick Reference

### File Locations
| Content Type | Location | Line Range (approx) |
|-------------|----------|---------------------|
| SEO Metadata | `index.html` | 1-75 |
| CSS Variables | `index.html` (`<style>`) | 88-150 |
| Navigation | `index.html` | ~500-700 |
| Hero Animation | `index.html` | ~2700-2840 |
| Latest Release | `index.html` | ~2843-2900 |
| News Section | `index.html` | ~2905-2945 |
| Music Section | `index.html` | ~2946-3120 |
| Videos (AvarexTV) | `index.html` | ~3121-3247 |
| Photo Gallery | `index.html` | ~3248-3357 |
| Career Highlights | `index.html` | ~3358-3525 |
| Booking Form | `index.html` | ~3526-3615 |
| Contact Form | `index.html` | ~3616-3700 |
| Hero Animation Script | `index.html` (embedded) | Bottom of file |
| Media Integration | `assets/js/media-integration.js` | 1-225 |

### CSS Variable Quick Reference
```css
/* Colors */
--color-primary: #000000
--color-secondary: #333333
--color-accent: #d92122
--color-background: #ffffff

/* Fonts */
--font-primary: 'Montserrat', sans-serif
--font-secondary: 'Open Sans', sans-serif

/* Spacing */
--spacing-xs: 0.5rem
--spacing-sm: 1rem
--spacing-md: 2rem
--spacing-lg: 3rem
--spacing-xl: 4rem

/* Transitions */
--transition-fast: 0.2s ease
--transition-normal: 0.3s ease
--transition-slow: 0.5s ease
```

### Command Quick Reference
```bash
# Development
npm install              # Install dependencies
npm start               # Start dev server (localhost:3000)

# Media Optimization
./optimize-images.sh    # Optimize images
./optimize-media.sh     # Optimize audio

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to remote
git checkout -b feat/X  # Create feature branch

# Netlify Deployment
# (automatic on push to main)
```

---

## Maintenance Notes

### When to Update This File
- Major architectural changes
- New conventions established
- New sections added to website
- New tools or scripts added
- Deployment process changes
- Common issues discovered

### Version History
- **v1.0** (2025-11-26): Initial comprehensive documentation

---

**For AI Assistants:** This document is your primary reference for working on this codebase. When in doubt, refer to this file first, then examine the code. Always maintain the existing architectural patterns and conventions unless explicitly asked to change them.

**Questions or Updates Needed?** Discuss with the project owner before making significant changes to architecture or workflow.
