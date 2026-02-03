---
title: "collect_contact Tool"
description: "Collect visitor contact information (name, email, company, purpose) and send Zoom meeting link via Resend email with Redis-backed rate limiting"
date: 2025-11-02
status: stable
tags: [api, tool, contact, email, resend, rate-limiting, redis]
---

# collect_contact Tool

Collect visitor contact information and send Omer's Zoom meeting link via email using Resend.

## Purpose

Enables proactive contact collection from engaged visitors. Collects name, email, company, and purpose information, validates the email (format + disposable domain detection), stores contact data in Redis (7-day TTL), and sends a professional email with Omer's Zoom meeting link and resume download links via Resend.

## Use Cases

- User expresses interest: "I'd like to schedule a call"
- Recruiter asks: "Can you send me your Zoom link?"
- User requests: "Email me the meeting link"
- AI detects high engagement (3+ messages, project views, resume downloads)
- User says: "Let's connect" or "I want to discuss an opportunity"
- Proactive follow-up after meaningful conversation

## Endpoint

```
POST /api/tools/collect-contact
GET  /api/tools/collect-contact  (Health check only)
```

**Rate Limit**: 5 collections per IP per 24 hours (Redis-backed)

**Feature Flag**: `ENABLE_CONTACT_COLLECTION=true` (required)

## Input Schema

### Parameters

```typescript
{
  name: string,              // Required, 2-100 chars
  email: string,             // Required, valid email format
  company?: string,          // Optional, max 100 chars
  purpose: string,           // Required enum
  notes?: string,            // Optional, max 500 chars
  preferredTime?: string     // Optional, free-form text
}
```

| Parameter       | Type   | Required | Constraints   | Description                           |
| --------------- | ------ | -------- | ------------- | ------------------------------------- |
| `name`          | string | Yes      | 2-100 chars   | Visitor's full name                   |
| `email`         | string | Yes      | Valid email   | Visitor's email address               |
| `company`       | string | No       | Max 100 chars | Company name                          |
| `purpose`       | enum   | Yes      | See below     | Reason for contact                    |
| `notes`         | string | No       | Max 500 chars | Additional context from conversation  |
| `preferredTime` | string | No       | Free-form     | Preferred meeting time (if mentioned) |

### Purpose Values

| Value         | Description                             |
| ------------- | --------------------------------------- |
| `hire`        | Job opportunity, full-time position     |
| `collaborate` | Partnership, collaboration, open-source |
| `interview`   | Interview request, technical screening  |
| `consult`     | Consulting engagement, advisory         |
| `other`       | General inquiry, networking             |

### Validation Rules

- **Email Format**: Must be valid email format (RFC 5322 compliant)
- **Disposable Domains**: Blocked (e.g., tempmail.com, guerrillamail.com)
- **Name Length**: 2-100 characters (prevents single-char entries)
- **Company Length**: Max 100 characters
- **Notes Length**: Max 500 characters
- **Purpose**: Must be one of 5 allowed values

## Output Schema

### Success Response

```typescript
{
  success: true,
  emailSent: boolean,        // Email delivery status
  zoomLink?: string,         // Zoom meeting link (if email sent)
  message: string,           // Confirmation message
  messageId?: string         // Resend message ID (for tracking)
}
```

### Error Response

```typescript
{
  success: false,
  error: string              // Error message
}
```

## Examples

### Example 1: Successful Contact Collection with Email

**Request (POST)**:

```bash
curl -X POST http://localhost:3001/api/tools/collect-contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "email": "sarah.johnson@techcorp.com",
    "company": "TechCorp Inc",
    "purpose": "hire",
    "notes": "Looking for a Full-Stack Developer with AI experience",
    "preferredTime": "Next Tuesday afternoon"
  }'
```

**Response**:

```json
{
  "success": true,
  "emailSent": true,
  "zoomLink": "https://us06web.zoom.us/j/2675124566?pwd=...",
  "message": "Contact information collected successfully! Zoom link sent to sarah.johnson@techcorp.com",
  "messageId": "re_abcd1234xyz"
}
```

### Example 2: Rate Limit Exceeded

**Request** (6th request from same IP within 24h):

```bash
curl -X POST http://localhost:3001/api/tools/collect-contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "purpose": "other"
  }'
```

**Response** (429 Too Many Requests):

```json
{
  "success": false,
  "error": "Rate limit exceeded. Maximum 5 contact collections per 24 hours. Please try again later."
}
```

### Example 3: Disposable Email Blocked

**Request**:

```bash
curl -X POST http://localhost:3001/api/tools/collect-contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@tempmail.com",
    "purpose": "other"
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Disposable email addresses are not allowed. Please use a professional email."
}
```

### Example 4: Invalid Email Format

**Request**:

```bash
curl -X POST http://localhost:3001/api/tools/collect-contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "not-an-email",
    "purpose": "hire"
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

### Example 5: Health Check (GET)

**Request**:

```bash
curl http://localhost:3001/api/tools/collect-contact
```

**Response** (if enabled):

```json
{
  "available": true,
  "endpoint": "/api/tools/collect-contact",
  "method": "POST",
  "requiredFields": ["name", "email", "purpose"],
  "optionalFields": ["company", "notes", "preferredTime"]
}
```

**Response** (if disabled):

```json
{
  "available": false,
  "reason": "Feature disabled"
}
```

## Email Template

The Resend email sent to the visitor includes:

### Subject

```
Here's your meeting link with Omer Akben
```

### Content

- **Personalized Greeting**: "Hi {name},"
- **Purpose Acknowledgment**: Customized message based on `purpose` field
- **Zoom Meeting Link**: Clickable button with Omer's Zoom link
- **Resume Download Links**:
  - Original Resume (1-page PDF)
  - Extended Resume (2-page PDF)
- **Professional Signature**: Omer's contact information
- **Branding**: Consistent with omerakben.com design system

### Example Email

```
Hi Sarah,

Thank you for your interest in a job opportunity!

I'm excited to connect with you. Here's my Zoom meeting link:

[Schedule Meeting] (button)

You can also download my resume:
- Original Resume (1-page)
- Extended Resume (2-page)

Looking forward to our conversation!

Best regards,
Omer Akben
Full-Stack Developer | AI Enthusiast
me@omerakben.com
```

## Rate Limiting

### Configuration

- **Limit**: 5 collections per IP address per 24 hours
- **Implementation**: Redis-backed via Upstash (sliding window)
- **Scope**: Per-IP tracking (supports recruiting teams at same company)
- **Bypass**: Not available (security feature)

### Rationale

- **5 per 24h**: Allows recruiting teams (shared IP) while preventing spam
- **IP-based**: Prevents anonymous abuse without requiring authentication
- **24h Window**: Balances accessibility with abuse prevention

### Rate Limit Headers

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 2
Retry-After: 43200  (seconds until reset)
```

## Data Storage

### Redis Storage (7-day TTL)

```typescript
{
  name: "Sarah Johnson",        // PII redacted in logs
  email: "s***@techcorp.com",   // Partially redacted in logs
  company: "TechCorp Inc",
  purpose: "hire",
  notes: "Looking for...",
  preferredTime: "Next Tuesday",
  collectedAt: "2025-11-02T14:30:00Z",
  ipAddress: "192.168.1.xxx"    // Last octet redacted in logs
}
```

### Key Format

```
contact:collection:{emailHash}
contact:rate-limit:ip:{ipAddress}
```

### Auto-Expiration

- **Contact Data**: 7-day TTL (automatic deletion)
- **Rate Limit Counter**: 24-hour TTL
- **Purpose**: GDPR compliance, privacy protection

## Error Handling

### Common Errors

| Status | Error                    | Cause                             | Solution                     |
| ------ | ------------------------ | --------------------------------- | ---------------------------- |
| 400    | Invalid email format     | Email validation failed           | Provide valid email          |
| 400    | Disposable email blocked | Temporary email detected          | Use professional email       |
| 400    | Name too short           | Name < 2 chars                    | Provide full name            |
| 400    | Notes too long           | Notes > 500 chars                 | Shorten notes field          |
| 400    | Invalid purpose          | Purpose not in enum               | Use valid purpose value      |
| 429    | Rate limit exceeded      | 5+ requests in 24h                | Wait until rate limit resets |
| 500    | Email send failed        | Resend API error                  | Retry after a few seconds    |
| 503    | Feature disabled         | `ENABLE_CONTACT_COLLECTION=false` | Feature not available        |

## Environment Variables Required

```bash
# Feature flag
ENABLE_CONTACT_COLLECTION=true

# Resend API
RESEND_API_KEY=re_...

# Contact info
OMER_EMAIL=me@omerakben.com
OMER_ZOOM_LINK=https://us06web.zoom.us/j/2675124566?pwd=...

# Redis (rate limiting + storage)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

## Implementation Details

**File Location**: `src/app/api/tools/collect-contact/route.ts`

**Tool Implementation**: `src/lib/tools/implementations/collect-contact.ts`

- Email validation (format + disposable domains)
- Redis storage with PII redaction
- Resend email delivery
- Rate limiting logic

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `collectContactInputSchema`
- Output: `collectContactOutputSchema`

**Email Template**: `src/lib/email/templates/ZoomLinkEmail.tsx`

- React Email component
- Professional branding
- Resume download links

**Features**:

- ✅ Email validation (format + disposable domain detection)
- ✅ Redis-backed rate limiting (5 per IP per 24h)
- ✅ PII redaction in logs
- ✅ 7-day data retention (auto-expiration)
- ✅ Professional email template (Resend + React Email)
- ✅ Resume download links in email
- ✅ Feature flag control
- ✅ Health check endpoint (GET)

## Privacy & Security

- ✅ **PII Redaction**: Email and IP partially redacted in logs
- ✅ **7-day TTL**: Contact data auto-deleted after 7 days
- ✅ **Rate Limiting**: Prevents spam and abuse
- ✅ **Disposable Email Blocking**: Professional emails only
- ✅ **Server-Side Only**: No client exposure of Resend API key
- ✅ **GDPR Compliant**: Data minimization, auto-deletion
- ✅ **Feature Flag**: Can be disabled instantly if needed

## Related Tools

- [get_contact](get-contact.md) - Retrieve Omer's contact information
- [download_resume](download-resume.md) - Download resume (included in email)
- [provide_navigation_links](provide-navigation-links.md) - Navigation menu with contact link

## Performance Notes

- **Email Delivery**: ~1-2 seconds (Resend API latency)
- **Redis Operations**: <50ms (Upstash latency)
- **Total Response Time**: ~1.5-2.5 seconds
- **Retry Strategy**: Exponential backoff for Resend failures

## Testing

### Local Testing (with .env.local)

```bash
# Set environment variables
ENABLE_CONTACT_COLLECTION=true
RESEND_API_KEY=re_test_...
OMER_EMAIL=test@example.com
OMER_ZOOM_LINK=https://zoom.us/test

# Test request
curl -X POST http://localhost:3001/api/tools/collect-contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","purpose":"other"}'
```

### Health Check

```bash
curl http://localhost:3001/api/tools/collect-contact
```

## Changelog

- **2025-10-29**: Increased rate limit from 1 to 5 per 24h (recruiting teams)
- **2025-10-27**: Added resume download links to email template
- **2025-10-27**: Initial implementation with Resend integration
- **2025-10-27**: Implemented Redis-backed rate limiting
- **2025-10-27**: Added disposable email detection
- **2025-10-27**: Implemented PII redaction and 7-day TTL
