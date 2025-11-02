---
title: "Accessibility Guide"
description: "WCAG 2.1 Level AA compliance guide: keyboard navigation, focus indicators, screen reader support, 8-mode brightness system, and automated E2E testing"
date: 2025-11-02
status: stable
tags: [accessibility, wcag, a11y, compliance, testing]
---

# Accessibility Guide

This document outlines the accessibility features and compliance measures implemented in omerakben.com.

## Target Compliance

**WCAG 2.1 Level AA** - Web Content Accessibility Guidelines

## Key Accessibility Features

### 1. Keyboard Navigation

#### Skip to Content

- **Component**: `src/components/skip-to-content.tsx`
- **Behavior**: Hidden until focused with Tab key
- **Target**: `#main-content` on main element
- **Styling**: High contrast, visible outline

**Testing**:

```
1. Press Tab key on page load
2. Verify "Skip to main content" link appears
3. Press Enter to jump to main content
4. Focus should move to main content area
```

#### Tab Navigation

- All interactive elements accessible via Tab/Shift+Tab
- Logical tab order (top to bottom, left to right)
- No keyboard traps
- Focus indicators visible on all interactive elements

**Focus Order**:

1. Skip to content link
2. Logo/home link
3. Navigation links (Journey, Projects, Skills, etc.)
4. Brightness control
5. Chat button
6. Main content interactive elements
7. Footer links

### 2. Focus Indicators

#### Enhanced Focus Styles

- **Location**: `src/app/globals.css`
- **Implementation**: CSS `:focus-visible` pseudo-class

**Styles**:

```css
/* General focus */
*:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Buttons with glow */
button:focus-visible {
  outline: 2px solid var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(brand-primary, 0.2);
}

/* Links with underline */
a:focus-visible {
  outline: 2px solid var(--brand-primary);
  text-decoration: underline;
}

/* Form inputs */
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--brand-primary);
  border-color: var(--brand-primary);
}
```

**Features**:

- Visible in all 8 brightness modes (-3 to +3)
- High contrast (always uses --brand-primary)
- Offset for clarity
- No `:focus` styles that interfere with mouse users

### 3. Semantic HTML & ARIA

#### Landmarks

All pages use proper HTML5 semantic elements:

```html
<header>          <!-- Site header with navigation -->
<nav>             <!-- Navigation menu -->
<main id="main-content">  <!-- Main content area -->
<footer>          <!-- Site footer -->
<section>         <!-- Content sections -->
<article>         <!-- Independent content pieces -->
```

#### Heading Hierarchy

- Single `<h1>` per page (page title)
- Logical nesting: h1 → h2 → h3 (no skipping levels)
- Descriptive heading text

**Example Structure**:

```html
<h1>Omer Akben - AI/ML Engineer</h1>
  <h2>Featured Projects</h2>
    <h3>Elon AI Agent</h3>
    <h3>Genesis Test Copilot</h3>
  <h2>Testimonials</h2>
    <h3>Leadership Testimonials</h3>
```

#### ARIA Labels

- All icon-only buttons have `aria-label`
- All images have `alt` text (or `alt=""` if decorative)
- Form inputs associated with labels
- Dynamic content uses `aria-live` regions

**Examples**:

```tsx
// Icon button
<Button aria-label="Open chat sidebar">
  <MessageCircle className="h-5 w-5" />
</Button>

// Brightness control
<Button aria-label="Set minimum brightness">
  <Moon className="h-4 w-4" />
</Button>

// Dynamic content (toast notifications)
<Toaster richColors position="top-center" />  {/* Built-in aria-live */}
```

### 4. Color Contrast

#### 8-Mode Brightness System

All text and interactive elements maintain WCAG AA contrast ratios across all 8 brightness modes.

**Contrast Requirements**:

- **Normal text**: 4.5:1 minimum
- **Large text** (18pt+ or 14pt bold+): 3:1 minimum
- **Interactive elements**: 3:1 minimum
- **Focus indicators**: 3:1 minimum

**Testing Process**:

1. Test each brightness mode: -3, -2, -1, 0, +1, +2, +3, auto
2. Use Chrome DevTools Accessibility panel
3. Check contrast ratios for:
   - Text on backgrounds
   - Borders on backgrounds
   - Button states (default, hover, focus)
   - Link colors

#### Color Independence

- Information not conveyed by color alone
- Icons and text labels used together
- State changes include multiple cues (color + icon + text)

**Example**:

```tsx
// Good: Multiple indicators
<Badge className="bg-brand-primary">
  <Check className="h-3 w-3 mr-1" />
  Complete
</Badge>

// Avoid: Color only
<Badge className="bg-green-500">Complete</Badge>
```

### 5. Screen Reader Support

#### Text Alternatives

- All images have descriptive `alt` text
- Decorative images use `alt=""`
- Icon-only buttons have `aria-label`
- Complex graphics have extended descriptions

#### Form Accessibility

- All inputs have associated labels
- Error messages linked to inputs
- Required fields marked with `aria-required`
- Validation errors announced

**Example**:

```tsx
<div>
  <label htmlFor="email" className="block mb-2">
    Email Address <span className="text-destructive">*</span>
  </label>
  <Input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <p id="email-error" className="text-destructive" role="alert">
      Please enter a valid email address
    </p>
  )}
</div>
```

#### Live Regions

- Toast notifications use `role="status"` or `role="alert"`
- Dynamic content changes announced
- Loading states communicated

### 6. Responsive Design

#### Mobile Accessibility

- Touch targets minimum 44×44 pixels (iOS/Android guideline)
- Adequate spacing between interactive elements
- Mobile-friendly navigation (hamburger menu)
- Viewport properly configured

**Meta Tag**:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### Text Scaling

- Supports browser text zoom up to 200%
- No horizontal scrolling at 200% zoom
- Relative units (rem, em) for typography
- Flexible layouts (flexbox, grid)

### 7. Motion & Animation

#### Reduced Motion Support

Respects `prefers-reduced-motion` system preference:

```tsx
// Example: Conditional animation
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? {} : { duration: 0.5 }}
>
  {content}
</motion.div>
```

**Implementation**:

- All animations respect `prefers-reduced-motion: reduce`
- Essential animations (UI feedback) remain but simplified
- Auto-play animations can be paused
- No flashing content (WCAG 2.3.1)

## Testing Checklist

### Automated Testing

- [ ] Run axe DevTools scan (0 violations target)
- [ ] Run Lighthouse accessibility audit (100 score target)
- [ ] Run WAVE accessibility checker
- [ ] Validate HTML (no errors)

### Manual Testing

#### Keyboard Navigation

- [ ] Tab through entire page
- [ ] All interactive elements reachable
- [ ] Focus order logical
- [ ] No keyboard traps
- [ ] Escape key closes modals/dialogs
- [ ] Arrow keys work in components (dropdowns, etc.)

#### Screen Readers

- [ ] Test with NVDA (Windows, free)
- [ ] Test with JAWS (Windows, trial)
- [ ] Test with VoiceOver (macOS/iOS, built-in)
- [ ] Test with TalkBack (Android, built-in)

**Testing Flow**:

1. Navigate by headings (H key in NVDA/JAWS)
2. Navigate by landmarks (D key in NVDA/JAWS)
3. Navigate by links (Tab key)
4. Read all content in order (Down arrow)
5. Test form interactions
6. Test dynamic content updates

#### Visual Testing

- [ ] Test all 8 brightness modes
- [ ] Verify contrast ratios (use Chrome DevTools)
- [ ] Test with browser zoom (100%-200%)
- [ ] Test with Windows High Contrast mode
- [ ] Test with color blindness simulators

#### Mobile Testing

- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test with VoiceOver on iOS
- [ ] Test with TalkBack on Android
- [ ] Verify touch target sizes

### Automated Accessibility Testing

**Status:** ✅ **8/8 routes passing WCAG 2A compliance** (via Playwright + axe-core)

**Implementation:**

- **Test Suite**: `e2e/a11y.spec.ts` using Playwright and axe-core
- **Coverage**: All primary routes tested for WCAG 2A violations
- **CI/CD Integration**: Accessibility tests run on every push as part of 6 quality gates
- **Command**: `npm run test:e2e` to run all E2E tests including accessibility

**Routes Tested:**

1. ✅ `/` - Homepage with hero, featured projects, and AI assistant
2. ✅ `/projects` - Project showcase with filtering
3. ✅ `/skills` - Technical skills visualization
4. ✅ `/journey` - Career timeline
5. ✅ `/credentials` - Education and certifications
6. ✅ `/contact` - Contact information
7. ✅ `/recruiter` - Recruiter-focused hub
8. ✅ `/chat` - AI assistant chat interface

**Testing Methodology:**

- Waits for full React hydration before axe scan (SSR → client-side)
- Validates against WCAG 2.1 Level A and AA rules
- Detects critical, serious, moderate, and minor violations
- Fails CI/CD pipeline if any violations detected

**Accessibility Standards Enforced:**

- Color contrast ratios (WCAG 2A)
- ARIA landmark usage
- Semantic HTML structure
- Keyboard navigation patterns
- Focus management
- Screen reader compatibility

## Known Limitations

### Current Gaps (To Be Addressed)

- [ ] Alt text audit needed for all images
- [ ] Form validation messages need ARIA associations
- [ ] Chat interface needs focus trap when open
- [ ] Video captions (if videos added in future)

### Third-Party Components

- Using shadcn/ui components (accessibility built-in)
- Using Radix UI primitives (WCAG AA compliant)
- Framer Motion animations (reduced motion supported)

## Development Guidelines

### When Adding New Features

#### Buttons

```tsx
// Good: Descriptive text or aria-label
<Button aria-label="Download resume in PDF format">
  <Download className="h-4 w-4 mr-2" />
  Download Resume
</Button>

// Avoid: Icon only without label
<Button><Download /></Button>
```

#### Links

```tsx
// Good: Descriptive link text
<Link href="/projects/elon-ai-agent">
  View Elon AI Agent project details
</Link>

// Avoid: Generic link text
<Link href="/projects/elon-ai-agent">Click here</Link>
```

#### Images

```tsx
// Good: Descriptive alt text
<Image
  src="/projects/genesis.png"
  alt="Genesis Test Copilot dashboard showing test execution metrics"
  width={600}
  height={400}
/>

// Decorative images
<Image
  src="/decorative-pattern.svg"
  alt=""
  aria-hidden="true"
  width={100}
  height={100}
/>
```

#### Forms

```tsx
// Good: Associated label and error handling
<div>
  <label htmlFor="name">Full Name *</label>
  <Input
    id="name"
    type="text"
    required
    aria-required="true"
    aria-invalid={errors.name ? "true" : "false"}
    aria-describedby={errors.name ? "name-error" : undefined}
  />
  {errors.name && (
    <p id="name-error" className="text-destructive" role="alert">
      {errors.name.message}
    </p>
  )}
</div>
```

### Code Review Checklist

When reviewing PRs, check for:

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on icon-only buttons
- [ ] Alt text on images
- [ ] Form labels associated with inputs
- [ ] Color contrast sufficient
- [ ] Heading hierarchy logical
- [ ] No keyboard traps
- [ ] Reduced motion respected

## Resources

### Standards & Guidelines

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) (Browser extension)
- [WAVE](https://wave.webaim.org/) (Web accessibility checker)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Built into Chrome)
- [NVDA Screen Reader](https://www.nvaccess.org/) (Free, Windows)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Learning Resources

- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
