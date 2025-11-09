---
title: "get_contact Tool"
description: "Retrieve Omer's contact information including email, location, LinkedIn, GitHub, and optional phone/Twitter links"
date: 2025-11-02
status: stable
tags: [api, tool, contact, social, communication]
---

# get_contact Tool

Retrieve Omer's contact information including email, social media links, and location.

## Purpose

Provides comprehensive contact information for reaching Omer Akben. Returns email, location, LinkedIn, GitHub, and optional phone/Twitter links. Used when users want to connect, follow, or reach out for opportunities.

## Use Cases

- User asks "How can I contact you?"
- User requests "What's your email?"
- User wants to "connect on LinkedIn"
- Recruiter needs contact information
- User asks "Where are you located?"
- User wants to "see your GitHub profile"
- Display contact page information

## Endpoint

```
GET  /api/tools/get-contact
POST /api/tools/get-contact
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{}  // No input parameters required
```

This tool accepts an empty object (no parameters needed).

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    contact: {
      email: string,        // Primary email address
      phone?: string,       // Phone number (optional)
      location: string,     // City, State or City, Country
      linkedin: string,     // LinkedIn profile URL
      github: string,       // GitHub profile URL
      twitter?: string      // Twitter/X profile URL (optional)
    }
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

### Example 1: Get Contact Information

**Request (GET)**:

```bash
curl http://localhost:3000/api/tools/get-contact
```

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/get-contact \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "contact": {
      "email": "me@omerakben.com",
      "phone": "+1 (267) 512-4566",
      "location": "Raleigh, NC",
      "linkedin": "https://www.linkedin.com/in/omerakben",
      "github": "https://github.com/omerakben",
      "twitter": "https://twitter.com/omerakben"
    }
  }
}
```

### Example 2: Minimal Contact Info (Optional Fields Not Provided)

**Response** (when phone/twitter not configured):

```json
{
  "success": true,
  "data": {
    "contact": {
      "email": "me@omerakben.com",
      "location": "Raleigh, NC",
      "linkedin": "https://www.linkedin.com/in/omerakben",
      "github": "https://github.com/omerakben"
    }
  }
}
```

## Contact Information Fields

### Required Fields (Always Present)

| Field      | Type   | Description                    | Format Example                          |
| ---------- | ------ | ------------------------------ | --------------------------------------- |
| `email`    | string | Primary email address          | `me@omerakben.com`                      |
| `location` | string | Current city and state/country | `Raleigh, NC`                           |
| `linkedin` | string | LinkedIn profile URL           | `https://www.linkedin.com/in/omerakben` |
| `github`   | string | GitHub profile URL             | `https://github.com/omerakben`          |

### Optional Fields

| Field     | Type   | Description                      | Format Example                  |
| --------- | ------ | -------------------------------- | ------------------------------- |
| `phone`   | string | Phone number (optional)          | `+1 (267) 512-4566`             |
| `twitter` | string | Twitter/X profile URL (optional) | `https://twitter.com/omerakben` |

## Data Source

Contact information is sourced from `src/data/facts.ts` (single source of truth):

```typescript
{
  email: "me@omerakben.com",
  location: "Raleigh, NC",
  linkedin: "https://www.linkedin.com/in/omerakben",
  github: "https://github.com/omerakben",
  // Optional fields may be present
}
```

## Error Handling

### Common Errors

| Status | Error                 | Cause                   | Solution                       |
| ------ | --------------------- | ----------------------- | ------------------------------ |
| 400    | Invalid request       | Malformed JSON body     | Verify JSON syntax (POST only) |
| 429    | Rate limit exceeded   | Too many requests       | Wait 60 seconds and retry      |
| 500    | Internal server error | Data source unavailable | Retry after a few seconds      |

## Implementation Details

**File Location**: `src/app/api/tools/get-contact/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `getContactInputSchema` (empty object)
- Output: `getContactOutputSchema`, `contactInfoSchema`

**Data Source**: `src/data/facts.ts`

- Exported `personalInfo` object
- Contact information fields

**Features**:

- ✅ Supports both GET and POST (no parameters needed)
- ✅ Zod schema validation
- ✅ Single source of truth (facts.ts)
- ✅ Optional fields for flexibility
- ✅ Validated email format
- ✅ Validated URL formats for social links
- ✅ Server-side only (no client exposure)

## Usage Patterns

### Pattern 1: Display Contact Page

```typescript
// Fetch contact info for contact page
const response = await fetch('/api/tools/get-contact');
const { data } = await response.json();

// Render contact links
<a href={`mailto:${data.contact.email}`}>Email</a>
<a href={data.contact.linkedin} target="_blank">LinkedIn</a>
<a href={data.contact.github} target="_blank">GitHub</a>
```

### Pattern 2: AI Assistant Response

```typescript
// User asks: "How can I reach Omer?"
const { data } = await getContact();

// AI response:
"You can reach Omer via:
- Email: me@omerakben.com
- LinkedIn: linkedin.com/in/omerakben
- GitHub: github.com/omerakben
- Location: Raleigh, NC"
```

### Pattern 3: Email Integration

```typescript
// Create mailto link with subject
const { data } = await getContact();
const mailtoLink = `mailto:${data.contact.email}?subject=Job Opportunity`;

// Open email client
window.location.href = mailtoLink;
```

## Privacy & Security

- ✅ **Public Information Only**: All returned information is publicly available on social profiles
- ✅ **No PII Exposure**: Phone number and Twitter are optional (may not be returned)
- ✅ **Rate Limited**: Prevents scraping and abuse (60 req/min)
- ✅ **Server-Side Only**: Contact data never exposed in client bundles
- ✅ **GDPR Compliant**: User-provided public information only

## Related Tools

- [collect_contact](collect-contact.md) - Collect visitor contact and send Zoom link
- [download_resume](download-resume.md) - Download resume for detailed qualifications
- [list_projects](list-projects.md) - View Omer's project portfolio
- [provide_navigation_links](provide-navigation-links.md) - Get navigation menu with contact link

## Performance Notes

- **Response Size**: ~300 bytes (minimal overhead)
- **Cache Duration**: Consider 1-hour browser cache (contact info rarely changes)
- **Latency**: <10ms (in-memory data source)

## Changelog

- **2025-10-20**: Initial implementation with core contact fields
- **2025-10-21**: Added optional phone and Twitter fields
- **2025-10-22**: Validated all URL formats with Zod
