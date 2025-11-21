---
title: "download_resume Tool"
description: "Download Omer's professional resume in PDF format (2-page, 88KB) with Google Drive fallback"
date: 2025-11-20
status: stable
tags: [api, tool, resume, pdf, document-management]
---

# download_resume Tool

Download Omer's professional resume in PDF format - unified comprehensive 2-page resume.

## Purpose

Provides direct download URL for Omer's professional resume in PDF format with Google Drive fallback link for reliable access. This tool is used when visitors want to download or review Omer's qualifications.

## Use Cases

- User asks "Can I see your resume?"
- User requests "Send me your CV"
- User wants to download resume for job application review
- Recruiter needs resume file for internal systems
- User asks "Do you have a PDF of your experience?"

## Endpoint

```
GET  /api/tools/download-resume
POST /api/tools/download-resume
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{
  format?: "resume"  // Default: "resume" (single format only)
}
```

| Parameter | Type | Required | Default    | Description                  |
| --------- | ---- | -------- | ---------- | ---------------------------- |
| `format`  | literal | No    | `"resume"` | Resume format: `"resume"` only |

### Validation Rules

- `format` must be `"resume"` (literal type)
- Defaults to `"resume"` if not specified
- **Note**: DOCX format is not available (PDF only)

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    url: string,              // Local download URL
    filename: string,         // PDF filename
    size: number,             // File size in bytes (88320 = ~86.3KB)
    format: string,           // "pdf"
    googleDriveUrl: string    // Google Drive fallback link
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string               // Error message
}
```

## Examples

### Example 1: Download Professional Resume (Default)

**Request (GET)**:

```bash
curl http://localhost:3000/api/tools/download-resume
```

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "/assets/Omer_Akben_Resume.pdf",
    "filename": "Omer_Akben_Resume.pdf",
    "size": 88320,
    "format": "pdf",
    "googleDriveUrl": "https://drive.google.com/file/d/1_Q4LEz9emCn2FpR5Mbw9eSi62Rs1HOYw/view?usp=sharing"
  }
}
```

### Example 2: Invalid Format Error

**Request**:

```bash
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" \
  -d '{"format": "extended"}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid literal value, expected \"resume\""
}
```

## Available Format

### Professional Resume (2-page)

- **File**: `Omer_Akben_Resume.pdf`
- **Size**: 88KB (~86.3KB / 88,320 bytes)
- **Content**: Comprehensive 2-page professional resume covering 6+ years of AI/ML engineering and QA automation experience
- **Use Case**: Complete professional overview for hiring managers, recruiters, and technical interviews
- **Google Drive**: [View/Download](https://drive.google.com/file/d/1_Q4LEz9emCn2FpR5Mbw9eSi62Rs1HOYw/view?usp=sharing)

## Error Handling

### Common Errors

| Status | Error               | Cause                        | Solution              |
| ------ | ------------------- | ---------------------------- | --------------------- |
| 400    | Invalid format      | Format not `"resume"`        | Use `"resume"` only   |
| 400    | Invalid request     | Malformed JSON body          | Verify JSON syntax    |
| 429    | Rate limit exceeded | Too many requests            | Wait 60s and retry    |

## Implementation Details

**File Location**: `src/app/api/tools/download-resume/route.ts`

**Schema Location**: `src/lib/tools/zod-schemas.ts`

- Input: `downloadResumeInputSchema`
- Output: `downloadResumeOutputSchema`

**Static Files**: `/public/assets/`

- `Omer_Akben_Resume.pdf` (88KB)
- `Omer_Akben_Resume.md` (source of truth markdown)

**Features**:

- ✅ Supports both GET (query params) and POST (JSON body)
- ✅ Zod schema validation with literal type
- ✅ Google Drive fallback link for reliability
- ✅ File size metadata for UI progress indicators
- ✅ Server-side only (no client exposure)
- ✅ Single unified format (simplified from dual-format system)

## Related Tools

- [download_certificate](download-certificate.md) - Download AWS/NSS certificates
- [get_contact](get-contact.md) - Retrieve contact information
- [collect_contact](collect-contact.md) - Collect visitor contact with Zoom link email

## Changelog

- **2025-11-20**: Unified to single format (removed "extended" option)
- **2025-11-20**: Updated Google Drive URL to new unified resume
- **2025-11-20**: Changed schema from enum to literal type
- **2025-11-20**: Updated file size to 88320 bytes (88KB)
- **2025-10-29**: Removed DOCX format (PDF-only policy)
- **2025-10-27**: Added Google Drive fallback URLs
- **2025-10-20**: Initial implementation with 2 PDF formats
