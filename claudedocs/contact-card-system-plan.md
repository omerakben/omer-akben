# Contact Card System Design Plan

**Date**: October 26, 2025
**Objective**: Create a consistent, reusable contact card component system for the contact page with brand-aware hover effects

---

## 📊 Current State Analysis

### Existing Design Patterns Found

#### **1. Card Hover States** (from codebase analysis)

- Standard hover: `hover:border-brand-primary/40` to `/50`
- Glassmorphism cards: `bg-surf-1/80 backdrop-blur-sm`
- Shadow on hover: `hover:shadow-xl hover:shadow-brand-primary/10`
- Border transition: `transition-all duration-300` to `duration-500`
- Scale effect: `hover:scale-[1.02]` (used in hero stat cards)

#### **2. Icon Background Pattern**

```tsx
// From credential-card.tsx and journey-hero.tsx
<div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary">
  <Icon className="w-6 h-6" />
</div>
```

#### **3. Button Pattern**

```tsx
// From button.tsx
bg-gradient-to-r from-brand-primary to-accent-primary
```

#### **4. Current LinkedIn Card Issues**

- ❌ Uses hardcoded LinkedIn color `bg-[#0077B5]` instead of design system
- ❌ Doesn't follow the glassmorphism pattern used elsewhere
- ❌ Lacks the hover gradient overlay effect
- ❌ No decorative corner accent
- ❌ Inconsistent with other cards in the app

---

## 🎨 Brand Colors Reference

### Platform-Specific Colors

```typescript
const CONTACT_BRAND_COLORS = {
  linkedin: {
    primary: '#0077B5',
    hover: '#006399',
    light: 'rgba(0, 119, 181, 0.1)',
  },
  github: {
    primary: '#24292e',    // Dark mode
    secondary: '#ffffff',  // Light mode bg
    hover: '#171a1e',
    light: 'rgba(36, 41, 46, 0.1)',
  },
  email: {
    primary: 'var(--brand-primary)',
    hover: 'var(--brand-primary)',
    light: 'var(--brand-primary)/10',
  },
  phone: {
    primary: 'var(--accent-primary)',
    hover: 'var(--accent-primary)',
    light: 'var(--accent-primary)/10',
  },
  calendar: {
    primary: '#4285F4',  // Google Calendar blue
    hover: '#3367D6',
    light: 'rgba(66, 133, 244, 0.1)',
  },
} as const;
```

---

## 🏗️ Proposed Component Architecture

### Component Hierarchy

```
ContactMethodCard (reusable base)
├── LinkedIn
├── GitHub
├── Email
├── Phone
└── Calendar/Meeting
```

### ContactMethodCard Props Interface

```typescript
interface ContactMethodCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  brandColor: {
    primary: string;
    hover: string;
    light: string;
  };
  external?: boolean;
  showCTA?: boolean;
  ctaText?: string;
}
```

---

## 🎯 Design Specifications

### Base Card Structure

```tsx
<Card className="group relative overflow-hidden border-border-line hover:border-[BRAND]/50 transition-all duration-300">
  {/* Hover gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-[BRAND]/5 to-[BRAND]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

  <CardContent className="relative p-6">
    {/* Icon + Info Row */}
    <div className="flex items-center gap-4">
      {/* Icon with default state */}
      <div className="p-3 rounded-xl bg-surf-2 border border-border-line group-hover:bg-[BRAND]/10 group-hover:border-[BRAND]/30 transition-all">
        <Icon className="w-6 h-6 text-text-2 group-hover:text-[BRAND] transition-colors" />
      </div>

      {/* Label & Value */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-3 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-text-1 font-medium truncate">{value}</p>
      </div>
    </div>

    {/* Optional CTA Button */}
    {showCTA && (
      <Button className="w-full mt-4 bg-[BRAND] hover:bg-[BRAND_HOVER]">
        {ctaText}
      </Button>
    )}

    {/* Decorative accent */}
    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[BRAND]/20 group-hover:bg-[BRAND]/40 transition-colors" />
  </CardContent>
</Card>
```

### Visual States

#### **Default State**

- Border: `border-border-line`
- Icon bg: `bg-surf-2` with neutral border
- Icon color: `text-text-2`
- No gradient overlay

#### **Hover State**

- Border: `hover:border-[BRAND_COLOR]/50`
- Icon bg: `bg-[BRAND_COLOR]/10`
- Icon border: `border-[BRAND_COLOR]/30`
- Icon color: `text-[BRAND_COLOR]`
- Gradient overlay: `from-[BRAND]/5 to-[BRAND]/10` fades in
- Decorative accent: `bg-[BRAND]/40`
- Shadow: `hover:shadow-lg hover:shadow-[BRAND]/10`

---

## 📋 Implementation Plan

### Phase 1: Create Base Component

**File**: `/src/components/contact/contact-method-card.tsx`

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface BrandColors {
  primary: string;
  hover: string;
  light: string;
}

interface ContactMethodCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  brandColors: BrandColors;
  external?: boolean;
  showCTA?: boolean;
  ctaText?: string;
  delay?: number;
}

export function ContactMethodCard({
  icon: Icon,
  label,
  value,
  href,
  brandColors,
  external = false,
  showCTA = false,
  ctaText = "Connect",
  delay = 0,
}: ContactMethodCardProps) {
  // Implementation here
}
```

### Phase 2: Create Contact Brand Colors Config

**File**: `/src/config/contact-brands.ts`

```typescript
export const CONTACT_BRANDS = {
  linkedin: {
    primary: '#0077B5',
    hover: '#006399',
    light: 'rgba(0, 119, 181, 0.1)',
  },
  github: {
    primary: '#24292e',
    hover: '#171a1e',
    light: 'rgba(36, 41, 46, 0.1)',
  },
  // ... etc
} as const;
```

### Phase 3: Create Specific Card Components

**Files**:

- `/src/components/contact/linkedin-contact-card.tsx`
- `/src/components/contact/github-contact-card.tsx`
- `/src/components/contact/email-contact-card.tsx`
- `/src/components/contact/phone-contact-card.tsx`
- `/src/components/contact/calendar-contact-card.tsx`

Each wraps `ContactMethodCard` with platform-specific props.

### Phase 4: Update Contact Page

**File**: `/src/app/contact/page.tsx`

Replace the existing "Contact Information" card section with a grid of contact method cards.

---

## 🎨 Visual Mockup (Text-Based)

### Default State

```
┌─────────────────────────────────────┐
│  [Icon]    LINKEDIN                │  ← Neutral colors
│  neutral   Omer AKBEN              │
│  bg        Full-Stack Developer... │
│                                     │
│  [Connect Button - Hidden]         │
│                              ○      │  ← Subtle accent
└─────────────────────────────────────┘
```

### Hover State

```
┌─────────────────────────────────────┐
│  [Icon]    LINKEDIN                │  ← LinkedIn blue
│  #0077B5   Omer AKBEN              │  ← Blue tint overlay
│  bg+glow   Full-Stack Developer... │
│                                     │
│  [View LinkedIn Profile] →         │  ← Appears
│                              ●      │  ← Brighter
└─────────────────────────────────────┘
```

---

## 🔄 Migration Strategy

### Step 1: Create New Components ✅

- Don't break existing functionality
- Build alongside current implementation
- Test in isolation

### Step 2: Update Contact Page

- Replace old LinkedIn card with new system
- Add other contact method cards
- Maintain responsive grid layout

### Step 3: Deprecate Old Components

- Remove `/src/components/linkedin-profile-card.tsx`
- Remove unused LinkedIn badge CSS

---

## 📱 Responsive Layout

### Desktop (lg+)

```
Contact Information
┌──────────┬──────────┐
│ LinkedIn │  GitHub  │
├──────────┼──────────┤
│  Email   │  Phone   │
├──────────┴──────────┤
│     Calendar        │
└─────────────────────┘
```

### Tablet (md)

```
┌──────────┬──────────┐
│ LinkedIn │  GitHub  │
├──────────┴──────────┤
│  Email   │  Phone   │
├──────────┴──────────┤
│     Calendar        │
└─────────────────────┘
```

### Mobile (sm)

```
┌─────────────────────┐
│      LinkedIn       │
├─────────────────────┤
│       GitHub        │
├─────────────────────┤
│       Email         │
├─────────────────────┤
│       Phone         │
├─────────────────────┤
│      Calendar       │
└─────────────────────┘
```

---

## ⚡ Performance Considerations

1. **Use CSS custom properties** for brand colors when possible
2. **Lazy load** framer-motion if not already
3. **Optimize hover** transitions (use transform/opacity only)
4. **Memoize** color calculations

---

## ♿ Accessibility Requirements

- [ ] Proper ARIA labels for external links
- [ ] Keyboard navigation support
- [ ] Focus visible states
- [ ] Screen reader announcements for platform names
- [ ] High contrast in all 8 brightness modes
- [ ] Touch target min 44x44px

---

## 🧪 Testing Checklist

### Visual Testing

- [ ] All 8 brightness modes (-3 to +3)
- [ ] Mobile, tablet, desktop viewports
- [ ] Hover states for each card
- [ ] Focus states (keyboard nav)
- [ ] Long text truncation

### Functional Testing

- [ ] External links open in new tab
- [ ] Email/phone links work correctly
- [ ] Buttons are clickable
- [ ] Animations perform smoothly

### Cross-browser

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

---

## 📦 Component API Examples

### LinkedIn Card Usage

```tsx
<LinkedInContactCard
  value="Omer AKBEN"
  subtitle="Full-Stack Developer • AI Engineer • SDET"
  href="https://linkedin.com/in/omerakben"
  showCTA
  delay={0}
/>
```

### Email Card Usage

```tsx
<EmailContactCard
  value="me@omerakben.com"
  href="mailto:me@omerakben.com"
  delay={0.1}
/>
```

### Phone Card Usage

```tsx
<PhoneContactCard
  value="(267) 512-4566"
  href="tel:+12675124566"
  delay={0.2}
/>
```

---

## 🎯 Success Criteria

1. ✅ **Consistency**: All contact cards follow same pattern
2. ✅ **Brand Identity**: Hover reveals platform brand colors
3. ✅ **Reusability**: Easy to add new contact methods
4. ✅ **Performance**: Smooth 60fps animations
5. ✅ **Accessibility**: WCAG 2.1 AA compliant
6. ✅ **Responsive**: Works on all screen sizes
7. ✅ **Maintainable**: Clear component structure

---

## 🚀 Next Steps

1. **Review & Approve** this plan
2. **Create base component** with brand color support
3. **Build platform-specific cards** (LinkedIn, GitHub, etc.)
4. **Update contact page** with new card system
5. **Test across all browsers/modes**
6. **Cleanup deprecated code**

---

## 💡 Future Enhancements (Optional)

- Social proof indicators (follower count badges)
- Availability status indicator (green dot for "available")
- QR code generation on hover
- Copy-to-clipboard for email/phone
- Analytics tracking for contact method preferences

---

## 📝 Code Style Consistency

Following existing patterns from:

- `credential-card.tsx` - Glassmorphism & hover effects
- `journey-hero.tsx` - Stat card structure
- `button.tsx` - Brand gradient usage
- `globals.css` - Brand color variables

**Key Principles**:

- Use design system colors (no hardcoded hex except for external brands)
- Consistent transition durations (300ms standard, 500ms for complex)
- Group hover effects with `group` and `group-hover:`
- Framer Motion for entrance animations
- Lucide icons for consistency
