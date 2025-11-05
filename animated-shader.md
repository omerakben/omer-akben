# Animated Shader Blob Implementation

Complete documentation for the animated shader blob (WebGL "Ether" effect) used across the portfolio.

## Overview

**What:** WebGL-powered animated blob using ray marching technique from Shadertoy's "Ether" shader
**Where:** Navbar logo (64x64px) + Hero section (300x300px) + Static favicons
**Why:** Unique visual identity that adapts to 8 brightness modes and provides interactive feedback

## Components

### 1. `ShaderBlob` Component

**File:** `src/components/shader-blob.tsx`

**Features:**
- WebGL ray marching shader (based on "Ether" by nimitz)
- Dynamic color integration via CSS custom properties
- Mouse interaction (hover glow effect)
- Keyboard accessibility (Enter/Space triggers click)
- 8-mode brightness system integration via MutationObserver
- Reduced motion support
- SSR-safe hydration

**Props:**
```typescript
interface ShaderBlobProps {
  size?: number;                    // Canvas size in pixels (default: 300)
  onClick?: () => void;             // Click handler
  className?: string;               // Additional CSS classes
  disableCenterDimming?: boolean;   // Disable center darkening effect
}
```

**Usage:**
```tsx
import { ShaderBlob } from '@/components/shader-blob';

<ShaderBlob
  size={300}
  onClick={handleClick}
  disableCenterDimming={false}
/>
```

### 2. `ShaderBlobFallback` Component

**File:** `src/components/shader-blob-fallback.tsx`

**Features:**
- CSS gradient fallback when WebGL unavailable
- Identical API to ShaderBlob
- Uses design tokens (bg-brand-primary, bg-accent-primary)
- Pulsing animation with reduced motion support

**Usage:**
```tsx
import { ShaderBlobFallback } from '@/components/shader-blob-fallback';

<ShaderBlobFallback
  size={300}
  onClick={handleClick}
/>
```

### 3. `AnimatedBlobContainer` Component

**File:** `src/components/animated-blob-container.tsx`

**Features:**
- Smart WebGL detection wrapper
- SSR-safe (renders placeholder during hydration)
- Automatic fallback to CSS gradient if WebGL unavailable
- Props passed through to child component

**Usage (Recommended):**
```tsx
import { AnimatedBlobContainer } from '@/components/animated-blob-container';

// Automatically renders ShaderBlob or ShaderBlobFallback
<AnimatedBlobContainer
  size={64}
  disableCenterDimming={true}
  className="rounded-full"
  onClick={handleNavigation}
/>
```

## Implementations

### Navbar Logo (64x64px)

**File:** `src/components/app-header.tsx`

**Configuration:**
- Size: 64x64px (matches LOGO_SIZE constant)
- Center dimming: Disabled for flat appearance
- Shape: Rounded full (perfect circle)
- Click: Navigates to homepage

**Code:**
```tsx
<Link href="/" className="...">
  <AnimatedBlobContainer
    size={64}
    disableCenterDimming={true}
    className="rounded-full"
  />
</Link>
```

### Hero Section (300x300px)

**File:** `src/components/hero-section.tsx`

**Configuration:**
- Size: 300px (desktop), 250px (mobile)
- Center dimming: Enabled for depth effect
- Click: Opens Ozzy AI chat sidebar
- Visibility: Hidden on mobile (<lg breakpoint)

**Code:**
```tsx
<AnimatedBlobContainer
  size={300}
  onClick={openSidebar}
  className="shader-blob-breathe cursor-pointer"
  aria-label="Open Ozzy AI Assistant"
/>
```

### Static Favicons

**Generated Files:**
- `public/favicon_light/` - Bright favicons (brightness +2)
- `public/favicon_dark/` - Dark favicons (brightness -2)

**Sizes:**
- 16x16px (favicon-16x16.png)
- 32x32px (favicon-32x32.png)
- 180x180px (apple-touch-icon.png)
- 192x192px (android-chrome-192x192.png)
- 512x512px (android-chrome-512x512.png)
- Multi-size ICO (favicon.ico)

**Generation Script:**
```bash
npm run generate:favicons
```

**Requirements:**
- Dev server must be running (`npm run dev`)
- Playwright browser binaries installed
- Sharp image processing library

**Process:**
1. Launches Playwright browser
2. Sets brightness mode (+2 for light, -2 for dark)
3. Captures shader blob canvas screenshot
4. Resizes to all favicon sizes using Sharp
5. Saves to public/favicon_light and public/favicon_dark

## Browser Limitations

### Why Static Favicons?

**Problem:** Browsers don't support animated favicons via canvas/WebGL
**Attempted Solutions:**
- ❌ Data URI with canvas screenshot (blocked by browser security)
- ❌ Real-time WebGL rendering (not supported in favicon context)
- ❌ Animated GIF/APNG (performance issues, no WebGL)

**Final Solution:** ✅ Static PNG screenshots of shader blob
- Light theme: Brightness mode +2
- Dark theme: Brightness mode -2
- Theme switching via CSS media queries: `(prefers-color-scheme: light|dark)`

## 8-Mode Brightness Integration

### How It Works

1. **CSS Custom Properties** (src/app/globals.css):
   ```css
   [data-brightness="-3"] {
     --brand-primary: #064e3b;  /* Darkest green */
     --accent-primary: #1e3a8a; /* Darkest blue */
   }
   /* ... 6 more modes ... */
   ```

2. **MutationObserver** (ShaderBlob component):
   ```typescript
   const observer = new MutationObserver(() => {
     colors = getShaderColors(); // Re-read CSS custom properties
   });
   observer.observe(document.documentElement, {
     attributes: true,
     attributeFilter: ['data-brightness'],
   });
   ```

3. **WebGL Uniforms** (shader-blob.tsx):
   ```typescript
   gl.uniform3f(uniformLocations.uBrandColor, ...colors.brand);
   gl.uniform3f(uniformLocations.uAccentColor, ...colors.accent);
   ```

### Brightness Modes

| Mode | Label    | Brand Color | Accent Color | Use Case        |
|------|----------|-------------|--------------|-----------------|
| -3   | Darkest  | #064e3b     | #1e3a8a      | Deep dark mode  |
| -2   | Darker   | #065f46     | #1e40af      | Dark mode       |
| -1   | Dark     | #047857     | #2563eb      | Soft dark mode  |
| 0    | Baseline | #10b981     | #3b82f6      | Default         |
| +1   | Light    | #34d399     | #60a5fa      | Soft light mode |
| +2   | Lighter  | #6ee7b7     | #93c5fd      | Light mode      |
| +3   | Lightest | #a7f3d0     | #bfdbfe      | Bright mode     |
| auto | Auto     | System      | System       | Follows OS      |

## WebGL Shader Details

### Vertex Shader

Standard fullscreen quad setup:
```glsl
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;

void main() {
  gl_Position = aVertexPosition;
  vTextureCoord = aTextureCoord;
}
```

### Fragment Shader (Ether Effect)

**Technique:** Ray marching with metaball-like distance field
**Credits:** Based on "Ether" by nimitz (https://www.shadertoy.com/view/MsjSW3)
**License:** CC BY-NC-SA 3.0

**Key Features:**
- 6-iteration ray marching loop
- Dynamic rotation matrices for 3D effect
- Smooth color blending between brand/accent colors
- Mouse interaction (glow effect on hover)
- Center dimming for depth (optional)

**Uniforms:**
```glsl
uniform vec2 iResolution;      // Canvas size
uniform float iTime;           // Animation time
uniform vec2 iMouse;           // Mouse position (normalized)
uniform vec3 uBrandColor;      // Primary color (from CSS)
uniform vec3 uAccentColor;     // Secondary color (from CSS)
uniform bool disableCenterDimming; // Center darkening toggle
```

## Performance

### Optimizations

1. **Single requestAnimationFrame Loop:**
   - No multiple concurrent animation loops
   - Efficient GPU utilization

2. **Reduced Motion Support:**
   - Detects `prefers-reduced-motion: reduce`
   - Freezes animation time at 0 (static frame)
   - Still interactive (click/hover work)

3. **Resource Cleanup:**
   - Cancels animation frame on unmount
   - Deletes WebGL program and buffers
   - Disconnects MutationObserver

4. **Multiple Concurrent Instances:**
   - Navbar blob (64x64px) + Hero blob (300x300px)
   - No context exhaustion (tested with 2 concurrent WebGL contexts)
   - Minimal performance impact

### Bundle Impact

**Before navbar shader blob:**
- Homepage: ~5 kB

**After navbar shader blob:**
- Homepage: 5.01 kB (within 40 kB limit)
- No significant bundle size increase (shader code shared)

## Testing

### Unit Tests (27 tests total)

**File:** `src/components/__tests__/shader-blob.test.tsx`

**Coverage:**
- ShaderBlob component (14 tests)
  - WebGL initialization
  - Mouse interaction tracking
  - Keyboard accessibility (Enter/Space)
  - Reduced motion support
  - Custom className application
- ShaderBlobFallback component (9 tests)
  - CSS gradient rendering
  - Size configuration
  - Accessibility attributes
- AnimatedBlobContainer component (4 tests)
  - SSR safety (isMounted pattern)
  - WebGL detection
  - Props forwarding

### E2E Tests (35 tests total)

#### Hero Blob Tests (19 tests)
**File:** `e2e/shader-blob.spec.ts`

**Test Categories:**
1. Visual rendering (desktop/mobile viewports)
2. Interactivity (click, keyboard navigation)
3. Accessibility (ARIA attributes, role, tabindex)
4. 8 brightness modes (-3 to +3, auto)
5. WebGL feature detection
6. Performance (60fps, no console errors)
7. Reduced motion support

**Key Locator:** `section canvas[aria-label="Open Ozzy AI Assistant"]`

#### Navbar Blob Tests (16 tests)
**File:** `e2e/navbar-shader-blob.spec.ts`

**Test Categories:**
1. Visual rendering (64x64px verification)
2. Click navigation to homepage
3. Concurrent WebGL contexts (navbar + hero)
4. Accessibility (keyboard navigation)
5. Mobile navbar rendering
6. 8 brightness modes (-3 to +3, auto)
7. Performance (2 shader instances, no errors)

**Key Locator:** `header canvas` (or `header div[role="button"]` for fallback)

### Test Strategy

**Playwright Strict Mode:**
- All locators must resolve to exactly 1 element
- Hero tests scope to `section` parent
- Navbar tests scope to `header` parent
- Prevents ambiguity with multiple shader blobs on page

**Hydration Safety:**
- Tests wait for `networkidle` before assertions
- Accounts for SSR → client-side hydration timing

## Troubleshooting

### WebGL Not Rendering

**Symptoms:** Blob not visible, console error "WebGL not supported"

**Solutions:**
1. Check browser WebGL support: https://get.webgl.org/
2. Verify browser hardware acceleration enabled
3. Update graphics drivers
4. Fallback should render automatically (CSS gradient)

### Brightness Mode Not Updating

**Symptoms:** Blob color doesn't change when brightness mode switches

**Solutions:**
1. Check `data-brightness` attribute on `<html>` element
2. Verify CSS custom properties defined in globals.css
3. Check MutationObserver connection in console
4. Restart dev server to reload CSS

### Favicon Not Showing

**Symptoms:** Old favicon or no favicon visible

**Solutions:**
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Clear browser cache
3. Verify files exist in `public/favicon_light/` and `public/favicon_dark/`
4. Check metadata.ts has correct FAVICON_SOURCES paths
5. Re-generate favicons: `npm run generate:favicons`

### Multiple Shader Blobs Conflict

**Symptoms:** E2E tests fail with "strict mode violation" error

**Solutions:**
1. Scope locators to parent containers (`header`, `section`)
2. Use `.first()` or `.nth(0)` if truly selecting from multiple
3. Verify ARIA labels are unique if needed

### Performance Issues

**Symptoms:** Janky animation, low FPS, browser lag

**Solutions:**
1. Check if multiple shader instances running unnecessarily
2. Verify reduced motion detection working
3. Test on different browsers (Chrome/Firefox best WebGL support)
4. Reduce shader blob size if needed (300px → 250px)

## File Structure

```
src/
├── components/
│   ├── shader-blob.tsx                    # Main WebGL component
│   ├── shader-blob-fallback.tsx           # CSS gradient fallback
│   ├── animated-blob-container.tsx        # Smart wrapper with WebGL detection
│   ├── app-header.tsx                     # Navbar implementation (64x64px)
│   └── __tests__/
│       └── shader-blob.test.tsx           # Unit tests (27 tests)
├── lib/
│   ├── webgl-utils.ts                     # WebGL helper functions
│   └── constants.ts                       # LOGO_SIZE, FAVICON_SOURCES

e2e/
├── shader-blob.spec.ts                    # Hero blob E2E tests (19 tests)
└── navbar-shader-blob.spec.ts             # Navbar blob E2E tests (16 tests)

public/
├── favicon_light/                         # Light theme favicons (7 files)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── favicon.ico
│   └── site.webmanifest
└── favicon_dark/                          # Dark theme favicons (7 files)
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── favicon.ico
    └── site.webmanifest

scripts/
└── generate-shader-favicons.ts            # Favicon generation script
```

## Development Workflow

### Making Changes to Shader Blob

1. **Modify shader code** in `shader-blob.tsx` (VERTEX_SHADER or FRAGMENT_SHADER)
2. **Test changes** - browser auto-refreshes via Turbopack
3. **Run unit tests**: `npm test -- shader-blob.test.tsx`
4. **Run E2E tests**: `npm run test:e2e -- shader-blob.spec.ts`
5. **Regenerate favicons**: `npm run generate:favicons`
6. **Verify all quality gates**:
   ```bash
   npm run lint          # ESLint (0 errors)
   npx tsc --noEmit      # TypeScript (0 errors)
   npm test              # Unit tests (774/774 passing)
   npm run build         # Production build
   npm run size          # Bundle size
   npm run test:e2e      # E2E tests (100/114 passing)
   ```

### Adding New Brightness Mode

1. **Add mode to globals.css**:
   ```css
   [data-brightness="+4"] {
     --brand-primary: #d1fae5;
     --accent-primary: #dbeafe;
   }
   ```

2. **Update constants.ts**:
   ```typescript
   export const LIGHT_BRIGHTNESS_MODES = ["+1", "+2", "+3", "+4"] as const;
   ```

3. **Add E2E tests** for new mode in both shader-blob.spec.ts and navbar-shader-blob.spec.ts

4. **Regenerate favicons** if needed for new theme

## License

- **Ether Shader:** CC BY-NC-SA 3.0 (nimitz - https://www.shadertoy.com/view/MsjSW3)
- **Component Implementation:** Part of Omer Akben Portfolio (MIT License)

## Credits

- **Original Shader:** "Ether" by nimitz on Shadertoy
- **Integration:** Omer Akben (navbar logo, brightness system, accessibility, testing)
- **WebGL Utils:** Custom utilities for shader program creation and color extraction

---

**Last Updated:** November 4, 2025
**Test Coverage:** 35 E2E tests + 27 unit tests = 100% passing
**Bundle Impact:** <0.01 kB increase (shader code shared across instances)
