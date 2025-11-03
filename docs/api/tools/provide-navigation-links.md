---
title: "provide_navigation_links Tool"
description: "Generate navigation menu structure with labels, URLs, icons, and link types (internal/external) for dynamic UI rendering"
date: 2025-11-02
status: stable
tags: [api, tool, navigation, ui, menu]
---

# provide_navigation_links Tool

Generate navigation menu structure with typed links (internal/external), icons, and metadata for dynamic UI rendering.

## Purpose

Provides structured navigation link data for building dynamic navigation menus, sidebars, and action buttons. Returns an array of navigation links with labels, URLs, icon names (Lucide React), and link types. Used by AI assistant to suggest navigation actions and by UI components for consistent navigation patterns.

## Use Cases

- User asks "How do I navigate the site?"
- AI assistant suggests "You can view my projects" (generates navigation link)
- Dynamic navigation menu generation
- Action button rendering in chat responses
- Sidebar navigation structure
- Breadcrumb navigation
- Mobile menu generation

## Endpoint

```
POST /api/tools/provide-navigation-links
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{
  links: Array<{
    label: string,              // Button label text
    href: string,               // URL or path
    icon?: string,              // Icon name from lucide-react
    type: "internal" | "external"  // Link type
  }>
}
```

| Field           | Type   | Required | Description                                        |
| --------------- | ------ | -------- | -------------------------------------------------- |
| `links`         | array  | Yes      | Array of navigation link objects                   |
| `links[].label` | string | Yes      | Button/link text displayed to user                 |
| `links[].href`  | string | Yes      | URL or path to navigate to                         |
| `links[].icon`  | enum   | No       | Lucide React icon name (see allowed icons)         |
| `links[].type`  | enum   | Yes      | `"internal"` (same-site) or `"external"` (new tab) |

### Allowed Icons

| Icon Name       | Use Case                        |
| --------------- | ------------------------------- |
| `briefcase`     | Projects, portfolio             |
| `github`        | GitHub profile/repository links |
| `external-link` | External sites, new tab         |
| `arrow-right`   | Next page, continue             |
| `file-text`     | Documents, resume, certificates |
| `zap`           | Skills, capabilities            |
| `mail`          | Contact, email                  |

### Validation Rules

- `links` array is **required**
- Each link must have `label`, `href`, and `type`
- `icon` is optional (defaults to no icon)
- `type` must be `"internal"` or `"external"`
- `icon` must be one of 7 allowed values (if provided)

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    links: Array<{
      label: string,
      href: string,
      icon?: string,
      type: "internal" | "external"
    }>
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string  // Error message
}
```

## Examples

### Example 1: Portfolio Navigation Links

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/provide-navigation-links \
  -H "Content-Type: application/json" \
  -d '{
    "links": [
      {
        "label": "View Projects",
        "href": "https://omerakben.com/projects",
        "icon": "briefcase",
        "type": "internal"
      },
      {
        "label": "Download Resume",
        "href": "https://omerakben.com/assets/Omer_Akben_Resume.pdf",
        "icon": "file-text",
        "type": "internal"
      },
      {
        "label": "Connect on LinkedIn",
        "href": "https://www.linkedin.com/in/omerakben",
        "icon": "external-link",
        "type": "external"
      }
    ]
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "links": [
      {
        "label": "View Projects",
        "href": "https://omerakben.com/projects",
        "icon": "briefcase",
        "type": "internal"
      },
      {
        "label": "Download Resume",
        "href": "https://omerakben.com/assets/Omer_Akben_Resume.pdf",
        "icon": "file-text",
        "type": "internal"
      },
      {
        "label": "Connect on LinkedIn",
        "href": "https://www.linkedin.com/in/omerakben",
        "icon": "external-link",
        "type": "external"
      }
    ]
  }
}
```

### Example 2: Contact Actions

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/provide-navigation-links \
  -H "Content-Type: application/json" \
  -d '{
    "links": [
      {
        "label": "Send Email",
        "href": "mailto:me@omerakben.com",
        "icon": "mail",
        "type": "external"
      },
      {
        "label": "View GitHub",
        "href": "https://github.com/omerakben",
        "icon": "github",
        "type": "external"
      }
    ]
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "links": [
      {
        "label": "Send Email",
        "href": "mailto:me@omerakben.com",
        "icon": "mail",
        "type": "external"
      },
      {
        "label": "View GitHub",
        "href": "https://github.com/omerakben",
        "icon": "github",
        "type": "external"
      }
    ]
  }
}
```

### Example 3: Invalid Icon Error

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/provide-navigation-links \
  -H "Content-Type: application/json" \
  -d '{
    "links": [
      {
        "label": "Home",
        "href": "/",
        "icon": "home",
        "type": "internal"
      }
    ]
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid enum value. Expected 'briefcase' | 'github' | 'external-link' | 'arrow-right' | 'file-text' | 'zap' | 'mail', received 'home'"
}
```

### Example 4: Missing Type Error

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/provide-navigation-links \
  -H "Content-Type: application/json" \
  -d '{
    "links": [
      {
        "label": "Projects",
        "href": "/projects"
      }
    ]
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Required field 'type' is missing"
}
```

## Link Types

### Internal Links (`type: "internal"`)

- Same-site navigation (omerakben.com)
- No new tab
- Uses Next.js `<Link>` component
- Client-side routing (fast)
- Examples: `/projects`, `/contact`, `/skills`

### External Links (`type: "external"`)

- External sites or resources
- Opens in new tab (`target="_blank"`)
- Uses `<a>` tag with `rel="noopener noreferrer"`
- Security: Prevents `window.opener` access
- Examples: LinkedIn, GitHub, Google Drive

## Icon-Link Patterns

| Icon            | Label Examples                        | Typical Use        |
| --------------- | ------------------------------------- | ------------------ |
| `briefcase`     | "View Projects", "Portfolio"          | Project navigation |
| `github`        | "View GitHub", "Source Code"          | GitHub links       |
| `external-link` | "Visit Site", "Open Link"             | Generic external   |
| `arrow-right`   | "Continue", "Next"                    | Forward navigation |
| `file-text`     | "Download Resume", "View Certificate" | Documents          |
| `zap`           | "View Skills", "Capabilities"         | Skills/tech        |
| `mail`          | "Contact Me", "Send Email"            | Email actions      |

## UI Rendering Example

```tsx
import { ExternalLink, Briefcase, Mail } from "lucide-react";

const iconMap = {
  "external-link": ExternalLink,
  "briefcase": Briefcase,
  "mail": Mail,
  // ... other icons
};

// Render navigation links
{data.links.map((link) => {
  const Icon = link.icon ? iconMap[link.icon] : null;

  if (link.type === "external") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        {Icon && <Icon className="w-4 h-4" />}
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" />}
      {link.label}
    </Link>
  );
})}
```

## Error Handling

### Common Errors

| Status | Error               | Cause                             | Solution                    |
| ------ | ------------------- | --------------------------------- | --------------------------- |
| 400    | Invalid icon        | Icon not in allowed values        | Use valid icon name         |
| 400    | Invalid type        | Type not "internal" or "external" | Use valid link type         |
| 400    | Missing label       | Required field not provided       | Include label for each link |
| 400    | Missing href        | Required field not provided       | Include href for each link  |
| 400    | Missing type        | Required field not provided       | Include type for each link  |
| 429    | Rate limit exceeded | Too many requests                 | Wait 60 seconds and retry   |

## Implementation Details

**File Location**: `src/app/api/tools/provide-navigation-links/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `provideNavigationLinksInputSchema`
- Output: `provideNavigationLinksOutputSchema`

**Features**:

- ✅ Zod schema validation
- ✅ Icon whitelist (7 allowed Lucide icons)
- ✅ Link type enforcement (internal/external)
- ✅ Structured data for UI rendering
- ✅ Server-side only (no client exposure)

## Common Navigation Patterns

### Main Menu

```typescript
{
  links: [
    { label: "Projects", href: "/projects", icon: "briefcase", type: "internal" },
    { label: "Skills", href: "/skills", icon: "zap", type: "internal" },
    { label: "Contact", href: "/contact", icon: "mail", type: "internal" }
  ]
}
```

### Social Links

```typescript
{
  links: [
    { label: "GitHub", href: "https://github.com/omerakben", icon: "github", type: "external" },
    { label: "LinkedIn", href: "https://linkedin.com/in/omerakben", icon: "external-link", type: "external" }
  ]
}
```

### Document Downloads

```typescript
{
  links: [
    { label: "Resume", href: "/assets/resume.pdf", icon: "file-text", type: "internal" },
    { label: "Certificate", href: "/assets/cert.pdf", icon: "file-text", type: "internal" }
  ]
}
```

## Related Tools

- [navigate_page](navigate-page.md) - Navigate to pages programmatically
- [get_contact](get-contact.md) - Get contact information for links
- [download_resume](download-resume.md) - Generate resume download links
- [list_projects](list-projects.md) - List projects for navigation

## Performance Notes

- **Response Size**: ~100-300 bytes per link
- **Rendering**: Client-side icon lookup via Lucide
- **Caching**: Consider CDN caching for static navigation

## Changelog

- **2025-10-20**: Initial implementation with 7 icon types
- **2025-10-21**: Added internal/external link type validation
- **2025-10-22**: Enforced icon whitelist for security and consistency
