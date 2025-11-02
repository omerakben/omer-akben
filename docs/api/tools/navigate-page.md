---
title: "navigate_page Tool"
description: "Navigate to pages on omerakben.com domain with configurable wait conditions (load, domcontentloaded, networkidle)"
date: 2025-11-02
status: stable
tags: [api, tool, navigation, playwright, browser-automation]
---

# navigate_page Tool

Navigate to pages on the omerakben.com domain using browser automation with configurable wait conditions.

## Purpose

Provides programmatic page navigation for testing, automation, and AI assistant-driven browsing. Uses Playwright for reliable navigation with customizable wait conditions. Restricted to omerakben.com domain for security.

## Use Cases

- User asks "Go to the projects page"
- User requests "Show me the contact page"
- AI assistant navigates to relevant pages during conversation
- Automated testing workflows
- Page navigation in response to user queries
- Pre-loading pages for faster user experience

## Endpoint

```
POST /api/tools/navigate-page
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

**Browser Automation**: Uses Playwright (headless mode)

## Input Schema

### Parameters

```typescript
{
  url: string,                    // Required, must be omerakben.com domain
  waitUntil?: string             // Optional, default: "load"
}
```

| Parameter   | Type         | Required | Default  | Description                                            |
| ----------- | ------------ | -------- | -------- | ------------------------------------------------------ |
| `url`       | string (URL) | Yes      | -        | Full URL to navigate to (must be omerakben.com domain) |
| `waitUntil` | enum         | No       | `"load"` | Navigation wait condition                              |

### Wait Conditions

| Value              | Description                                         | Use Case                      |
| ------------------ | --------------------------------------------------- | ----------------------------- |
| `load`             | Wait for `load` event (DOM + resources)             | Default, most pages           |
| `domcontentloaded` | Wait for `DOMContentLoaded` event (DOM ready)       | Fast navigation, minimal wait |
| `networkidle`      | Wait for network to be idle (no requests for 500ms) | SPA, dynamic content          |

### Validation Rules

- `url` must be a valid URL
- `url` must have `omerakben.com` domain (security restriction)
- `waitUntil` must be one of: `"load"`, `"domcontentloaded"`, `"networkidle"`
- No relative URLs (must be full URL with protocol)

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    url: string,      // Final URL after navigation
    message: string   // Confirmation message
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string       // Error message
}
```

## Examples

### Example 1: Navigate to Projects Page (Default Wait)

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/navigate-page \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://omerakben.com/projects"
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "https://omerakben.com/projects",
    "message": "Successfully navigated to https://omerakben.com/projects"
  }
}
```

### Example 2: Navigate with Network Idle Wait

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/navigate-page \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://omerakben.com/chat",
    "waitUntil": "networkidle"
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "https://omerakben.com/chat",
    "message": "Successfully navigated to https://omerakben.com/chat"
  }
}
```

### Example 3: Invalid Domain Error

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/navigate-page \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://external-site.com/page"
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Navigation is restricted to omerakben.com domain"
}
```

### Example 4: Invalid URL Format

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/navigate-page \
  -H "Content-Type: application/json" \
  -d '{
    "url": "/projects"
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid URL format. Must be a full URL with protocol (https://)"
}
```

### Example 5: Invalid Wait Condition

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/navigate-page \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://omerakben.com/",
    "waitUntil": "immediate"
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid enum value. Expected 'load' | 'domcontentloaded' | 'networkidle', received 'immediate'"
}
```

## Valid Pages on omerakben.com

| Page        | URL                                 | Description             |
| ----------- | ----------------------------------- | ----------------------- |
| Home        | `https://omerakben.com/`            | Landing page            |
| Projects    | `https://omerakben.com/projects`    | Project portfolio       |
| Skills      | `https://omerakben.com/skills`      | Technical skills        |
| Journey     | `https://omerakben.com/journey`     | Career timeline         |
| Credentials | `https://omerakben.com/credentials` | Certificates, education |
| Contact     | `https://omerakben.com/contact`     | Contact information     |
| Recruiter   | `https://omerakben.com/recruiter`   | Recruiter-specific page |
| Chat        | `https://omerakben.com/chat`        | AI chat interface       |
| Status      | `https://omerakben.com/status`      | Site status page        |

## Wait Condition Recommendations

### Fast Pages (Static Content)

```typescript
{
  "url": "https://omerakben.com/contact",
  "waitUntil": "domcontentloaded"  // Fastest, DOM ready
}
```

### Standard Pages (Images, Fonts)

```typescript
{
  "url": "https://omerakben.com/projects",
  "waitUntil": "load"  // Default, all resources loaded
}
```

### Dynamic Pages (SPA, AJAX)

```typescript
{
  "url": "https://omerakben.com/chat",
  "waitUntil": "networkidle"  // Slowest, wait for network idle
}
```

## Error Handling

### Common Errors

| Status | Error               | Cause                    | Solution                                   |
| ------ | ------------------- | ------------------------ | ------------------------------------------ |
| 400    | Invalid URL         | Not a valid URL format   | Provide full URL with protocol             |
| 400    | Domain not allowed  | URL not on omerakben.com | Use omerakben.com URLs only                |
| 400    | Invalid waitUntil   | Not in allowed values    | Use load/domcontentloaded/networkidle      |
| 429    | Rate limit exceeded | Too many requests        | Wait 60 seconds and retry                  |
| 500    | Navigation timeout  | Page didn't load         | Check page exists, try different waitUntil |
| 500    | Network error       | Connection failed        | Verify URL, check network                  |

## Implementation Details

**File Location**: `src/app/api/tools/navigate-page/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `navigatePageInputSchema`
- Output: `navigatePageOutputSchema`

**Browser Automation**: Playwright

- Headless mode (no UI)
- Chromium browser
- 30-second timeout

**Features**:

- ✅ Domain restriction (security)
- ✅ Zod schema validation
- ✅ Configurable wait conditions
- ✅ Playwright browser automation
- ✅ Timeout handling (30s)
- ✅ Server-side only (no client exposure)

## Browser Automation Details

### Playwright Configuration

```typescript
{
  headless: true,                // No UI
  timeout: 30000,                // 30s navigation timeout
  waitUntil: "load",             // Default wait condition
  ignoreHTTPSErrors: false       // Strict SSL validation
}
```

### Resource Loading

- **load**: Wait for all resources (images, fonts, stylesheets)
- **domcontentloaded**: DOM parsed, scripts not waited for
- **networkidle**: No network activity for 500ms

## Performance Notes

| Wait Condition     | Avg Response Time | Use Case                |
| ------------------ | ----------------- | ----------------------- |
| `domcontentloaded` | ~500ms            | Fastest, minimal wait   |
| `load`             | ~1-2s             | Standard, all resources |
| `networkidle`      | ~2-5s             | Dynamic content, SPA    |

## Security Restrictions

- ✅ **Domain Whitelist**: Only omerakben.com allowed
- ✅ **HTTPS Only**: No HTTP navigation
- ✅ **No External Sites**: Prevents SSRF attacks
- ✅ **Rate Limiting**: 60 req/min prevents abuse
- ✅ **Timeout**: 30s max prevents hanging

## Related Tools

- [scroll_to_section](../api/tools/scroll-to-section.md) - Scroll to sections after navigation
- [extract_page_summary](extract-summary.md) - Extract page content after navigation
- [provide_navigation_links](provide-navigation-links.md) - Get navigation menu structure

## Testing

### Local Testing

```bash
# Test navigation to projects page
curl -X POST http://localhost:3000/api/tools/navigate-page \
  -H "Content-Type: application/json" \
  -d '{"url": "https://omerakben.com/projects"}'
```

### E2E Testing

Located in `e2e/agentic-sidebar.spec.ts`:

- Tests navigation to all pages
- Validates wait conditions
- Verifies domain restrictions

## Changelog

- **2025-10-20**: Initial implementation with Playwright
- **2025-10-21**: Added domain restriction for security
- **2025-10-22**: Implemented configurable wait conditions
