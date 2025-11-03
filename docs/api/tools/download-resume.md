---
title: "download_resume Tool"
description: "Download Omer's resume in PDF format - Original (1-page) or Extended (2-page) versions with Google Drive fallback links"
date: 2025-11-02
status: stable
tags: [api, tool, resume, pdf, document-management]
---

# download_resume Tool

Download Omer's resume in PDF format with two available versions: Original (1-page) and Extended (2-page).

## Purpose

Provides direct download URLs for Omer's professional resume in PDF format. Each version includes a Google Drive fallback link for reliable access. This tool is used when visitors want to download or review Omer's qualifications.

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
  format?: "resume" | "extended"  // Default: "resume"
}
```

| Parameter | Type | Required | Default    | Description                                                 |
| --------- | ---- | -------- | ---------- | ----------------------------------------------------------- |
| `format`  | enum | No       | `"resume"` | Resume format: `"resume"` (1-page) or `"extended"` (2-page) |

### Validation Rules

- `format` must be one of: `"resume"`, `"extended"`
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
    size: number,             // File size in bytes
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

### Example 1: Download Original Resume (Default)

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
    "size": 450000,
    "format": "pdf",
    "googleDriveUrl": "https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view?usp=sharing"
  }
}
```

### Example 2: Download Extended Resume

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" \
  -d '{"format": "extended"}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "/assets/Omer_Akben_Resume_Extended.pdf",
    "filename": "Omer_Akben_Resume_Extended.pdf",
    "size": 500000,
    "format": "pdf",
    "googleDriveUrl": "https://drive.google.com/file/d/1LiK6Q6BpnbfitPR-diaWR3ckGFv7yNFo/view?usp=sharing"
  }
}
```

### Example 3: Invalid Format Error

**Request**:

```bash
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" \
  -d '{"format": "docx"}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid enum value. Expected 'resume' | 'extended', received 'docx'"
}
```

## Available Formats

### Original Resume (1-page)

- **File**: `Omer_Akben_Resume.pdf`
- **Size**: ~450KB
- **Content**: Concise 1-page professional summary
- **Use Case**: Quick review, ATS systems, standard applications
- **Google Drive**: [View/Download](https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view?usp=sharing)

### Extended Resume (2-page)

- **File**: `Omer_Akben_Resume_Extended.pdf`
- **Size**: ~500KB
- **Content**: Detailed 2-page version with expanded project descriptions
- **Use Case**: Detailed review, hiring managers, technical interviews
- **Google Drive**: [View/Download](https://drive.google.com/file/d/1LiK6Q6BpnbfitPR-diaWR3ckGFv7yNFo/view?usp=sharing)

## Error Handling

### Common Errors

| Status | Error               | Cause                        | Solution                       |
| ------ | ------------------- | ---------------------------- | ------------------------------ |
| 400    | Invalid format      | Format not in allowed values | Use `"resume"` or `"extended"` |
| 400    | Invalid request     | Malformed JSON body          | Verify JSON syntax             |
| 429    | Rate limit exceeded | Too many requests            | Wait 60 seconds and retry      |

## Implementation Details

**File Location**: `src/app/api/tools/download-resume/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `downloadResumeInputSchema`
- Output: `downloadResumeOutputSchema`

**Static Files**: `/public/assets/`

- `Omer_Akben_Resume.pdf`
- `Omer_Akben_Resume_Extended.pdf`

**Features**:

- ✅ Supports both GET (query params) and POST (JSON body)
- ✅ Zod schema validation
- ✅ Google Drive fallback links for reliability
- ✅ File size metadata for UI progress indicators
- ✅ Server-side only (no client exposure)

## Related Tools

- [download_certificate](download-certificate.md) - Download AWS/NSS certificates
- [get_contact](get-contact.md) - Retrieve contact information
- [collect_contact](collect-contact.md) - Collect visitor contact with Zoom link email

## Changelog

- **2025-10-29**: Removed DOCX format (PDF-only policy)
- **2025-10-27**: Added Google Drive fallback URLs
- **2025-10-20**: Initial implementation with 2 PDF formats
