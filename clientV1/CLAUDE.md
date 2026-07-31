# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with React 19, TypeScript, and Vite. It uses React Router for navigation and showcases personal projects, certifications, tech stack, and an about section.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production (runs TypeScript compiler and Vite build)
pnpm build

# Preview production build
pnpm preview

# Format code (Prettier + Biome)
pnpm format

# Lint code (Biome)
pnpm lint
```

## Tech Stack

- **Build Tool**: Vite 6.x
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 (using @tailwindcss/vite plugin)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Code Quality**: Biome (extends ultracite config), Prettier, ESLint
- **Icons**: Lucide React, React Icons
- **Package Manager**: pnpm

## Architecture

### Routing Structure

The application uses React Router v7 with client-side routing configured in `src/App.tsx`:
- `/` - Homepage
- `/about` - About page with journey/timeline
- `/projects` - Projects showcase
- `/techStack` - Technology skills and tools
- `/certifications` - Certifications display
- `/404` - 404 error page

The root component hierarchy is: `BrowserRouter > SidebarProvider > App > Routes`

### Directory Structure

- `src/Pages/` - Page-level components, each with their own subdirectories for sub-components
- `src/Components/` - Reusable components (Navbar, Footer, social buttons, etc.)
- `src/Components/ui/` - shadcn/ui components (button, alert, sheet, sidebar, tooltip, etc.)
- `src/lib/` - Utility functions (primarily `cn()` for className merging)
- `src/hooks/` - Custom React hooks
- `public/` - Static assets

### Component Organization

Components follow a nested directory pattern where each component has its own folder. For example:
- `Pages/Projects/ProjectCard/` contains `ProjectCard.tsx` and subdirectories for `Collaborators/`, `TechBubble/`, `TechOfProject/`
- This pattern applies to most components in both `Pages/` and `Components/`

### Import Alias

The project uses `@/` as an alias for the `src/` directory, configured in both `vite.config.ts` and `tsconfig.json`:
```typescript
import { Component } from '@/Components/Component';
import { cn } from '@/lib/utils';
```

### UI Components

shadcn/ui components are configured with:
- Style: "new-york"
- Base color: "neutral"
- CSS variables enabled
- Lucide icons as the icon library
- No prefix for Tailwind classes

All shadcn/ui components are located in `src/Components/ui/` and use the `cn()` utility from `@/lib/utils` for className management.

### Styling

- Tailwind CSS v4 with Vite plugin integration
- Prettier with `prettier-plugin-tailwindcss` for automatic class sorting
- CSS variables for theming (configured in shadcn/ui setup)
- `tw-animate-css` for additional animation utilities

### Code Quality Tools

- **Biome**: Primary linter/formatter, extends the "ultracite" shared config
- **Prettier**: Code formatting with Tailwind class sorting
- **ESLint**: Additional linting (React-specific rules)
- **TypeScript**: Strict null checks enabled
- **Husky**: Git hooks setup (check `.husky/` for pre-commit hooks)

## Key Conventions

1. **Component Files**: Use PascalCase for component files matching the component name (e.g., `ProjectCard.tsx`)
2. **Styling**: Use Tailwind utility classes with the `cn()` helper for conditional/merged classes
3. **TypeScript**: Strict null checks are enabled; handle null/undefined explicitly
4. **Imports**: Prefer `@/` alias for all internal imports
5. **React Version**: Using React 19 (latest features available)

---

## Three.js Transformation Project

### Vision: "The Developer's Matrix"

This portfolio will transform into an immersive 3D experience that embodies Joseph's personality: a growth-obsessed, full-stack developer with military discipline, creative problem-solving, and a terminal/code aesthetic. The design merges **cyberpunk coding environments** with **Mac OS elegance** and **playful interactivity**.

### Design Philosophy

**Core Concept**: "Living Code Universe"
- **Matrix-Inspired**: Falling code particles, glowing terminal windows floating in 3D space
- **Interactive Solar System**: Projects orbit like planets, tech stack forms constellations
- **Journey as Railway**: Career timeline visualized as a train track through space
- **Terminal Aesthetic**: Dark charcoal void (#111827) with neon green (#05df72) and cyan accents
- **Performant**: 60fps on desktop, graceful degradation for mobile

### Personality-Driven Design Elements

1. **Growth Mindset**: Animated progress bars, skill trees growing in real-time
2. **Military Precision**: Grid systems, clean geometric shapes, snapping animations
3. **Playful Humor**: Easter eggs (spinning Mac traffic lights, 3D popcorn prophet)
4. **Developer-First**: Code snippets as 3D objects, terminal windows as navigation
5. **Problem Solver**: Interactive "fix the bug" mini-games in project showcases

### Color Palette (3D Enhanced)

```
Background Void: #0a0e1a (darker than #111827 for depth)
Primary Glow: #05df72 (WhatsApp green, neon emission)
Secondary Glow: #00d9ff (Cyan, tech accent)
Accent Yellow: #fdc700 (Achievement particles)
Code Matrix: #0f0 (Classic Matrix green)
Warning Red: #ff6467 (Error states, danger zones)
Terminal Text: #e0e0e0 (Bright white with slight warmth)
Fog/Atmosphere: rgba(5, 223, 114, 0.05) (Subtle green mist)
```

### Three.js Architecture

**Dependencies to Install**:
```bash
pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing leva
pnpm add -D @types/three
```

**Core Libraries**:
- `three` - Core 3D engine
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Helper components (Text3D, Stars, effects)
- `@react-three/postprocessing` - Bloom, glitch effects
- `leva` - Debug GUI (dev only)

**File Structure**:
```
src/
├── three/
│   ├── scenes/
│   │   ├── HeroScene.tsx          # Landing 3D hero
│   │   ├── ProjectGalaxy.tsx      # Projects as solar system
│   │   ├── TechConstellation.tsx  # Skills as star map
│   │   └── JourneyRailway.tsx     # Timeline as 3D path
│   ├── components/
│   │   ├── CodeMatrix.tsx         # Falling code particles
│   │   ├── TerminalWindow.tsx     # 3D floating terminal
│   │   ├── ProjectPlanet.tsx      # Individual project orb
│   │   ├── SkillNode.tsx          # Tech stack point
│   │   └── TrainTrack.tsx         # Journey segment
│   ├── effects/
│   │   ├── GlowEffect.tsx         # Neon bloom
│   │   ├── ScanlineEffect.tsx     # CRT monitor lines
│   │   └── ChromaticEffect.tsx    # RGB split on hover
│   ├── hooks/
│   │   ├── useMouseParallax.ts    # Camera follow mouse
│   │   ├── useScrollSync.ts       # Sync 3D with scroll
│   │   └── usePerformance.ts      # FPS monitoring
│   ├── shaders/
│   │   ├── hologram.glsl          # Holographic material
│   │   ├── matrix.glsl            # Code rain shader
│   │   └── neon.glsl              # Glowing edges
│   └── utils/
│       ├── geometries.ts          # Custom geometries
│       ├── materials.ts           # Reusable materials
│       └── animations.ts          # GSAP/Spring configs
```

---

## Implementation Roadmap

### Phase 1: Foundation Setup ✅ = Done | ⏳ = In Progress | ⬜ = Not Started

#### 1.1 Dependencies & Configuration ✅
- [x] Install Three.js ecosystem (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`)
- [x] Install GSAP for advanced animations
- [x] Configure Vite for GLSL shader imports (shaders directory created with neon, matrix, hologram shaders)
- [x] Set up performance monitoring tools
- [x] Create `src/three/` directory structure

#### 1.2 Base Scene Architecture ✅
- [x] Create `ThreeCanvas.tsx` wrapper component with suspense boundaries
- [x] Implement `PerformanceMonitor` with automatic quality adjustment
- [x] Set up camera controls with mouse parallax (useMouseParallax hook created)
- [x] Create `DebugPanel.tsx` with Leva controls (dev only)
- [x] Build `SceneTransition.tsx` for page route changes

#### 1.3 Core Utilities ✅
- [x] Create `useMouseParallax` hook for camera movement
- [x] Build `useScrollSync` for 3D/2D scroll synchronization
- [x] Implement `usePerformance` hook with FPS counter
- [x] Create custom geometries library (hexagons, crystals, stars, planets, tracks, phones, documents, trophies, cards)
- [x] Build materials library (neon, hologram, glass)

---

### Phase 2: Hero Section - "The Matrix Awakens"

#### 2.1 Code Matrix Background ✅
- [x] Create `CodeMatrix.tsx` with falling code particles (1000+ instances)
- [ ] Write custom shader for glowing text trails (using basic material, needs shader enhancement)
- [x] Implement LOD system (Level of Detail) for mobile (quality-based count adjustment)
- [x] Add random code snippets from actual projects (Python, JS, TS)
- [x] Optimize with instanced rendering

#### 2.2 Central Terminal Window ✅
- [x] Build `TerminalWindow.tsx` with glassmorphism material
- [x] Animate typing effect showing "Trying to get better everyday"
- [x] Add Mac OS traffic light buttons (3D, clickable Easter egg)
- [ ] Implement "boot sequence" animation on page load (simple fade-in exists, needs enhancement)
- [ ] Create fake file system explorer showing project structure

#### 2.3 Floating Name & Title ⏳
- [x] Create 3D text "Joseph Sabag" with neon edge glow
- [x] Animate "Full-Stack Developer" subtitle (no typing, static text)
- [x] Add orbit controls allowing user to rotate view
- [ ] Implement depth of field (DOF) for cinematic focus (needs PostProcessing enhancement)
- [x] Create pulsing "Scroll to Explore" indicator

#### 2.4 Interactive Elements ✅
- [x] Add clickable cubes showing tech stack icons (orbiting cubes exist)
- [x] Implement WhatsApp button as floating 3D phone
- [x] Create GitHub stars as actual 3D stars orbiting
- [x] Build CV download as 3D document that unfolds
- [ ] Add ambient sound toggle (keyboard typing sounds) - Future enhancement

**Phase 2 Summary:**
All core Phase 2 features are complete! The Hero Section now includes:
- Matrix-style falling code particles with instanced rendering
- Glassmorphism terminal window with Mac OS buttons and typing effect
- Floating name/title with 3D text and neon glow
- Orbiting tech stack cubes
- Interactive 3D buttons (WhatsApp, GitHub, CV Download)
- Performance-optimized with quality settings
- Post-processing effects (Bloom, scanlines)

---

### Phase 3: Projects Section - "Solar System"

#### 3.1 Galaxy Layout System ✅
- [x] Create `ProjectsScene.tsx` scene with orbital mechanics
- [x] Position projects as planets at different orbit radii (11 projects, radii from 3.5 to 10)
- [x] Implement real physics (slower outer orbits, faster inner)
- [x] Add central "sun" representing your core skills (size: 2, glowing green)
- [x] Create orbit rings for visual guidance
- **Note**: Created complete solar system with Stars background from drei, fog for depth, and proper lighting

#### 3.2 Project Planets ✅
- [x] Build `ProjectPlanet.tsx` component with custom materials
- [x] Each planet color represents project (color coded by tech/type)
- [x] Add atmospheric glow matching project primary color (3 layer glow with BackSide material)
- [x] Implement click to zoom into project details (ProjectDetailView modal)
- [x] Create rotation speed based on project orbit (outer = slower)
- **Additional**: Added status indicator rings for projects in development, collaborators as orbiting moons, hover effects with scale animation

#### 3.3 Project Detail View ✅
- [x] Build modal that transitions to close-up planet view (ProjectDetailView.tsx with GSAP camera animation)
- [x] Overlay 2D UI with project description, tech stack (Html component with styled div)
- [x] Show GitHub links with icons
- [x] Display collaborators as clickable GitHub links
- [x] Add "View Code" and "Live Demo" buttons with hover effects
- **Additional**: Status badges (Live/Development/Completed), tech stack pills, close button, enlarged planet view

#### 3.4 Navigation & Interaction ✅
- [x] Implement OrbitControls for camera exploration (zoom, pan, rotate with limits)
- [x] Add minimap showing all project positions (ProjectsMinimap.tsx with 2D map overlay)
- [x] Add tooltip hover states with project name/year (3D Text labels + Html tooltips)
- [x] Create instructions overlay for user guidance
- [x] Add legend showing project status colors
- **Note**: Search and filter functions deferred as minimap provides adequate navigation

**Phase 3 Summary:**
All core Phase 3 features are complete! The Projects Solar System now includes:
- 11 projects orbiting as planets with realistic physics
- Central sun representing core skills with 5 skill labels
- Color-coded planets by project type/tech
- Atmospheric glow effects and lighting
- Click-to-view modal with detailed project information
- Interactive minimap for navigation
- Collaborators shown as orbiting moons
- Status indicators (development rings, color coding)
- Performance optimized with quality settings (low/medium/high)
- Accessible via `/projects/3d` route
- Smooth GSAP camera animations
- Stars background and fog for depth
- Orbit rings as visual guides

**Files Created:**
- `src/three/data/projectsData.ts` - Project data structure with 11 projects
- `src/three/scenes/ProjectsScene.tsx` - Main solar system scene
- `src/three/components/ProjectPlanet.tsx` - Individual planet component
- `src/three/components/ProjectDetailView.tsx` - Modal detail view
- `src/three/components/ProjectsMinimap.tsx` - Navigation minimap
- `src/Pages/Projects/ProjectsThreeD.tsx` - Page wrapper with overlays

---

### Phase 4: Tech Stack - "Constellation Map"

#### 4.1 Star Field Layout ✅
- [x] Create `TechConstellation.tsx` with 3D space positioning (49 technologies organized in 3D space)
- [x] Group technologies by category (Frontend, Backend, Databases, DevOps, Tools, Languages)
- [x] Use constellation pattern matching skill relationships (26 connections mapped)
- [x] Add connecting lines (like star maps) showing tech dependencies (ConnectionLines with curved bezier paths)
- [x] Implement depth layering with category clustering (each category has distinct 3D region)
- **Additional**: Auto-rotate enabled, Stars background (8000 stars on high quality), category center markers with labels and glow

#### 4.2 Skill Nodes ✅
- [x] Build `SkillNode.tsx` as glowing orbs with tech logos (React Icons dynamically loaded)
- [x] Size based on proficiency level (small: 0.8, medium: 1.2, large: 1.8)
- [x] Color coding by category (green: frontend, cyan: backend, purple: databases, orange: devops, white: tools, yellow: languages)
- [x] Animate pulsing effect synced to "heartbeat" rhythm (sine wave pulse)
- [x] Add glow effects with 3-layer atmospheric halos
- **Additional**: Float animation from drei, proficiency ring indicator at base, hover states with scale animation, point lights for each node

#### 4.3 Interactive Exploration ✅
- [x] Click node to see detailed view with GSAP camera zoom (SkillDetailView.tsx)
- [x] Hover to highlight node with tooltip showing name, experience, proficiency
- [x] Show related technologies in detail view with connection strength
- [x] Visual dimming of unrelated technologies when one is selected
- [x] Category hover filtering (hover category label to see only those techs)
- **Additional**: Stats grid showing proficiency bar and years of experience, ESC key to close detail view, related tech chips with color coding

#### 4.4 Data Visualization ✅
- [x] Build bar charts as 3D pillars showing tech count by category (CategoryBarChart)
- [x] Create pie chart showing proficiency distribution (ProficiencyPieChart with ring segments)
- [x] Add timeline showing years of experience distribution (ExperienceTimeline with cylindrical bars)
- [x] Toggle button to show/hide data visualizations (Press D key or click button)
- [x] All charts with animated rotation and glowing materials
- **Additional**: Grid floor under bar chart, labels on all charts, positioned below constellation at y=-12

**Phase 4 Summary:**
All core Phase 4 features are complete! The Tech Stack Constellation now includes:
- 49 technologies organized as glowing orbs in 3D space
- 6 categories with spatial clustering (Frontend, Backend, Databases, DevOps, Tools, Languages)
- 26 connection lines showing relationships (primary and secondary)
- Animated particles traveling along connection lines
- Interactive nodes with hover tooltips and click-to-zoom detail view
- 3D data visualizations (bar chart, pie chart, timeline)
- Color-coded by category with category center markers
- Proficiency-based sizing and ring indicators
- Auto-rotate with orbit controls
- Performance optimized with quality settings
- Accessible via `/techStack/3d` route
- Stars background (8000 stars) and fog for depth
- GSAP camera animations for detail view
- Toggle for data visualizations (D key or button)

**Files Created:**
- `src/three/data/techStackData.ts` - Complete tech stack data (49 technologies, 26 connections)
- `src/three/scenes/TechConstellation.tsx` - Main constellation scene with category markers
- `src/three/components/SkillNode.tsx` - Individual technology orb with icons and effects
- `src/three/components/ConnectionLines.tsx` - Bezier connection lines with animated particles
- `src/three/components/SkillDetailView.tsx` - Modal detail view with stats and related techs
- `src/three/components/TechDataViz.tsx` - 3D data visualizations (bar/pie/timeline charts)
- `src/Pages/TechStack/TechStackThreeD.tsx` - Page wrapper with overlays and controls

---

### Phase 5: About/Journey - "The Railway Through Time"

#### 5.1 Track Construction ✅
- [x] Create `JourneyRailway.tsx` with curved Bezier path
- [x] Build railway ties and rails with metallic PBR materials
- [x] Position stations at career milestones (IDF, Bootcamp, Jobs)
- [x] Add scenery metadata (desert → city → tech hub)
- [x] Implement smooth camera dolly following track

#### 5.2 Train Animation ✅
- [x] Build 3D train model representing your journey
- [x] Animate train moving along track with scroll position
- [x] Add smoke/steam particles for achievements
- [x] Animate train wheels and bobbing motion
- [x] Implement headlight with spotlight

#### 5.3 Station Details ✅
- [x] Each station is a milestone (Military, Insurance, Bootcamp, etc.)
- [x] Click station to pause train and show detail panel
- [x] Display dates, achievements for each phase
- [x] Display skills gained at each milestone
- [x] Show category colors and labels
- [x] Keyboard shortcuts (ESC, arrow keys)
- **Additional**: GSAP camera animations, hover tooltips, floating animations, point lights per station
- **Note**: Ambient sounds and mini-scenes deferred as optional enhancements

#### 5.4 Interactive Timeline ✅
- [x] Build quick-jump navigation panel with all milestones
- [x] Smooth scroll to milestone on click
- [x] Arrow key navigation between stations
- [x] Progress indicator showing journey completion
- [x] Timeline scrubber with visual progress bar
- **Additional**: Scroll-synced train movement, milestone highlighting, category legend

**Phase 5 Summary:**
All core Phase 5 features are complete! The Journey Railway now includes:
- 10 career milestones organized along a curved 3D railway track
- 4 milestone categories with color coding (Military, Education, Work, Achievement)
- 5 track segments with Bezier curve paths for smooth transitions
- Animated 3D train with smoke particles, wheels, and headlight
- Scroll-synced train movement (300vh scrollable page)
- Interactive train stations with hover tooltips and click-to-explore
- Station detail view with GSAP camera zoom
- Achievement lists, skill tags, and timeline data for each milestone
- Quick-jump navigation panel with all milestones
- Progress indicator showing journey completion percentage
- Railway tracks with ties and rails
- Start marker (green glowing platform) and end marker (golden sphere)
- Smooth camera following train position
- Stars background (6000 stars) and fog for depth
- Arrow key navigation and ESC to close
- Performance optimized with quality settings
- Accessible via `/about/3d` route

**Files Created:**
- `src/three/data/journeyData.ts` - Career milestone data (10 milestones, 5 track segments)
- `src/three/scenes/JourneyRailway.tsx` - Main railway scene with train and stations
- `src/three/components/Train.tsx` - 3D train model with animations
- `src/three/components/TrainStation.tsx` - Interactive station markers
- `src/three/components/RailwayTrack.tsx` - Railway tracks with ties and rails
- `src/three/components/StationDetailView.tsx` - Modal detail view for milestones
- `src/Pages/About/AboutThreeD.tsx` - Page wrapper with scroll sync and overlays

---

### Phase 6: Certifications - "Trophy Case"

#### 6.1 Display Case Design ⬜
- [ ] Create glass display case with museum lighting
- [ ] Position certificates as floating 3D cards
- [ ] Add trophy models for special achievements (excellence awards)
- [ ] Implement rotating platform for featured certification
- [ ] Create gallery wall with all 9+ certifications

#### 6.2 Certificate Interaction ⬜
- [ ] Click to enlarge and read certificate details
- [ ] Add verification QR code as 3D scannable object
- [ ] Implement chronological sorting with animation
- [ ] Show completion bars for in-progress courses
- [ ] Create sparkle effect for recent certifications

---

### Phase 7: Navigation & UX ✅

#### 7.1 3D Navigation System ✅
- [x] Floating terminal menu (`FloatingNav.tsx`)
- [x] Spatial audio system (`useSpatialAudio.ts`)
- [x] 3D minimap (`Minimap3D.tsx`)
- [x] Breadcrumb trail (`BreadcrumbTrail.tsx`)
- [x] WASD keyboard controls (`useWASDControls.ts`)

#### 7.2 Loading Experience ✅
- [x] Custom loader with progress (`SceneLoader.tsx`)
- [x] Asset preloading system (`assetPreloader.ts`)
- [x] Humorous loading messages
- [x] Skip button for returning visitors

#### 7.3 Mobile Optimization ✅
- [x] Touch gesture controls (`useTouchGestures.ts`)
- [x] Device detection and quality adjustment (`deviceDetection.ts`)
- [x] Mobile optimization hook (`useMobileOptimization.ts`)
- [x] 2D fallback mode (`FallbackMode.tsx`)
- [x] Quality settings UI (`QualitySettings.tsx`)

**Files Created:**
- `src/three/components/FloatingNav.tsx`
- `src/three/components/Minimap3D.tsx`
- `src/three/components/BreadcrumbTrail.tsx`
- `src/three/components/SceneLoader.tsx`
- `src/three/components/FallbackMode.tsx`
- `src/three/components/QualitySettings.tsx`
- `src/three/hooks/useWASDControls.ts`
- `src/three/hooks/useSpatialAudio.ts`
- `src/three/hooks/useTouchGestures.ts`
- `src/three/hooks/useMobileOptimization.ts`
- `src/three/utils/assetPreloader.ts`
- `src/three/utils/deviceDetection.ts`

---

### Phase 8: Effects & Polish ✅

#### 8.1 Post-Processing Effects ✅
- [x] Bloom, chromatic aberration, film grain, scanlines, vignette (`PostProcessingEffects.tsx`)
- [x] Quality-aware settings (low/medium/high)

#### 8.2 Particle Systems ✅
- [x] All particle systems (`ParticleSystems.tsx`):
  - Achievement particles (yellow sparkles)
  - Code snippet particles (floating text)
  - Dust motes (ambient particles)
  - Fireflies (glowing orbs)
  - Confetti (celebration effect)

#### 8.3 Sound Design ✅
- [x] Sound management system (`SoundManager.tsx`)
- [x] Sound effects (click, hover, whoosh, success, error, typing, achievement)
- [x] Ambient sounds (space, terminal, music)
- [x] Volume control with localStorage
- [x] Sound toggle button
- [x] Custom hooks (`useSound`, `useSoundManager`)

**Files Created:**
- `src/three/effects/PostProcessingEffects.tsx`
- `src/three/components/ParticleSystems.tsx`
- `src/three/components/SoundManager.tsx`

**Phase 7 & 8 Summary:**
All navigation, UX, effects, and polish features complete! Ready for integration into existing scenes (Hero, Projects, Tech Stack, Journey).

**Integration Points:**
- Wrap app with `SoundManagerProvider` and `FallbackDetector`
- Add `QualitySettings` and `SoundToggleButton` UI overlays
- Use `useMobileOptimization()` in scenes for quality settings
- Add `FloatingNav` to scenes
- Add particle systems and post-processing as needed
- Add sound effects to interactive elements with `useSound()` hook

---

### Phase 9: Performance & Optimization

#### 9.1 Rendering Optimization ⬜
- [ ] Implement frustum culling (don't render off-screen)
- [ ] Use instanced meshes for repeated elements
- [ ] Add LOD (Level of Detail) for distant objects
- [ ] Optimize shader complexity for mobile
- [ ] Lazy load 3D scenes on route change

#### 9.2 Asset Optimization ⬜
- [ ] Compress textures to WebP/AVIF
- [ ] Use GLTF/GLB format for 3D models
- [ ] Implement texture atlases for UI elements
- [ ] Reduce polygon counts on background objects
- [ ] Add progressive model loading

#### 9.3 Monitoring & Analytics ⬜
- [ ] Track FPS and adjust quality automatically
- [ ] Monitor memory usage for leak detection
- [ ] Log scene transition times
- [ ] A/B test different effect intensities
- [ ] Collect device capability data

---

### Phase 10: Easter Eggs & Personality

#### 10.1 Hidden Interactions ⬜
- [ ] Konami code reveals "God Mode" (free camera)
- [ ] Typing "coffee" spawns floating coffee cup
- [ ] Click Mac close button → 3D alert window appears
- [ ] Secret dev console (press ` key)
- [ ] Hidden "popcorn prophet" character

#### 10.2 Humor & Playfulness ⬜
- [ ] 404 page shows lost astronaut in space
- [ ] "Loading" shows fake terminal commands
- [ ] Certificates have "Seal of Excellence" 3D stamp
- [ ] Train conductor tells dad jokes at stations
- [ ] WhatsApp button wiggles when hovered

---

## Technical Considerations

### Performance Targets
- **Desktop**: 60 FPS (1080p, high quality)
- **Laptop**: 45-60 FPS (adaptive quality)
- **Tablet**: 30 FPS (reduced particles)
- **Mobile**: 30 FPS (simplified scenes)
- **Load Time**: <3s on fast connection

### Browser Support
- Chrome 90+ (optimal)
- Firefox 88+ (good)
- Safari 15+ (acceptable, may need fallbacks)
- Edge 90+ (optimal)
- Mobile Safari (simplified)

### Accessibility
- Provide "Reduce Motion" toggle
- Keyboard navigation for all interactions
- Screen reader support with ARIA labels
- High contrast mode option
- Subtitle for any audio content

### SEO Considerations
- Server-side render static content
- Provide 2D fallback for crawlers
- Use semantic HTML under canvas
- Meta tags for each section
- Structured data for projects

---

## Development Workflow

### Testing Strategy
1. **Unit Tests**: Three.js components with React Testing Library
2. **Visual Regression**: Percy/Chromatic for scene snapshots
3. **Performance Tests**: Lighthouse CI, custom FPS benchmarks
4. **Cross-Browser**: BrowserStack for device testing
5. **User Testing**: Friends/colleagues try navigation

### Git Workflow
- `main` - Production ready
- `three-js-dev` - Active development
- Feature branches: `feat/code-matrix`, `feat/project-galaxy`
- Commit prefix: `[3D]` for Three.js changes

### Documentation
- Comment complex shader code thoroughly
- Document camera positions and paths
- Create video tutorials for maintenance
- Write performance optimization guide
- Keep scene hierarchy diagrams updated

---

## Success Metrics

### User Engagement
- Average session duration: >2 minutes (vs current <1 min)
- Scroll depth: 80%+ explore all sections
- Interaction rate: 60%+ click/hover elements
- Return visitor rate: 20%+ improvement

### Performance
- Lighthouse Performance Score: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

### Professional Impact
- GitHub profile views: +50%
- LinkedIn profile views: +100%
- Job inquiries: Track contact form submissions
- Portfolio shares: Social media mentions

---

## Future Enhancements (Post-Launch)

- [ ] VR mode for Meta Quest browsers
- [ ] Multiplayer mode (show other visitors as avatars)
- [ ] Custom cursor trails based on mouse speed
- [ ] AI chatbot as floating robot companion
- [ ] Export scene as video for social media
- [ ] Dark/Light mode toggle affecting scene lighting
- [ ] Seasonal themes (snow particles in winter)
- [ ] Integration with GitHub API for live contribution graph

---

## Resources & Learning

### Three.js Tutorials
- [Three.js Journey](https://threejs-journey.com/) - Best comprehensive course
- [Bruno Simon's Portfolio](https://bruno-simon.com/) - Inspiration
- [Awwwards Three.js sites](https://www.awwwards.com/websites/three-js/) - Examples

### React Three Fiber
- [Official Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Components](https://github.com/pmndrs/drei)
- [Codrops Tutorials](https://tympanus.net/codrops/tag/three-js/)

### Performance
- [Three.js Optimization Guide](https://discoverthreejs.com/tips-and-tricks/)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

---

## Notes for Future Claude Instances

This is an ambitious transformation that will take **40-60 hours of development**. The current portfolio has excellent content and structure—the goal is to enhance, not replace.

**Key Principles**:
1. **Performance First**: Never sacrifice usability for visual flair
2. **Progressive Enhancement**: 2D fallback always available
3. **Personality-Driven**: Every effect should reflect Joseph's identity
4. **Mobile-Friendly**: Most visitors will be on mobile
5. **Maintainable**: Clean code, good documentation, reusable components

**Joseph's Motto**: "Trying to get better everyday"
This portfolio should visually represent continuous growth, technical excellence, and creative problem-solving.
