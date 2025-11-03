---
title: "download_certificate Tool"
description: "Download Omer's professional certificates (AWS Cloud Practitioner or Nashville Software School) with metadata and fallback links"
date: 2025-11-02
status: stable
tags: [api, tool, certificate, credentials, document-management]
---

# download_certificate Tool

Download Omer's professional certificates with metadata including issuer, year, and Google Drive fallback links.

## Purpose

Provides direct download URLs for Omer's professional certificates in PDF format. Each certificate includes comprehensive metadata (issuer, year, full name) and Google Drive fallback links for reliable access.

## Use Cases

- User asks "Do you have any certifications?"
- User requests "Show me your AWS certificate"
- Recruiter wants to verify credentials
- User asks about Nashville Software School completion
- Hiring manager needs proof of training/education

## Endpoint

```
GET  /api/tools/download-certificate
POST /api/tools/download-certificate
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

## Input Schema

### Parameters

```typescript
{
  type: "aws" | "nss"  // Required
}
```

| Parameter | Type | Required | Description                                                                                          |
| --------- | ---- | -------- | ---------------------------------------------------------------------------------------------------- |
| `type`    | enum | Yes      | Certificate type: `"aws"` (AWS Cloud Practitioner Essentials) or `"nss"` (Nashville Software School) |

### Validation Rules

- `type` is **required**
- `type` must be one of: `"aws"`, `"nss"`
- No default value (explicit selection required)

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
    googleDriveUrl: string,   // Google Drive fallback link
    certificateName: string,  // Full certificate name
    issuer: string,           // Issuing organization
    year: string              // Year issued
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

### Example 1: Download AWS Certificate

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/download-certificate \
  -H "Content-Type: application/json" \
  -d '{"type": "aws"}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "/assets/Omer_Akben_AWS_Certificate.pdf",
    "filename": "Omer_Akben_AWS_Certificate.pdf",
    "size": 350000,
    "format": "pdf",
    "googleDriveUrl": "https://drive.google.com/file/d/...",
    "certificateName": "AWS Cloud Practitioner Essentials",
    "issuer": "Amazon Web Services",
    "year": "2024"
  }
}
```

### Example 2: Download NSS Certificate

**Request (GET)**:

```bash
curl "http://localhost:3000/api/tools/download-certificate?type=nss"
```

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "/assets/Omer_Akben_NSS_Certificate.pdf",
    "filename": "Omer_Akben_NSS_Certificate.pdf",
    "size": 400000,
    "format": "pdf",
    "googleDriveUrl": "https://drive.google.com/file/d/...",
    "certificateName": "Nashville Software School - Full Stack Web Development",
    "issuer": "Nashville Software School",
    "year": "2024"
  }
}
```

### Example 3: Missing Type Error

**Request**:

```bash
curl -X POST http://localhost:3000/api/tools/download-certificate \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Required field 'type' is missing"
}
```

### Example 4: Invalid Type Error

**Request**:

```bash
curl -X POST http://localhost:3000/api/tools/download-certificate \
  -H "Content-Type: application/json" \
  -d '{"type": "google"}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid enum value. Expected 'aws' | 'nss', received 'google'"
}
```

## Available Certificates

### AWS Cloud Practitioner Essentials

- **Type**: `"aws"`
- **Full Name**: AWS Cloud Practitioner Essentials
- **Issuer**: Amazon Web Services
- **Year**: 2024
- **File**: `Omer_Akben_AWS_Certificate.pdf`
- **Size**: ~350KB
- **Topics Covered**: Cloud concepts, AWS services, security, pricing

### Nashville Software School

- **Type**: `"nss"`
- **Full Name**: Nashville Software School - Full Stack Web Development
- **Issuer**: Nashville Software School
- **Year**: 2024
- **File**: `Omer_Akben_NSS_Certificate.pdf`
- **Size**: ~400KB
- **Program**: 6-month intensive full-stack development bootcamp

## Error Handling

### Common Errors

| Status | Error               | Cause                       | Solution                  |
| ------ | ------------------- | --------------------------- | ------------------------- |
| 400    | Missing type        | Required field not provided | Include `type` in request |
| 400    | Invalid type        | Type not in allowed values  | Use `"aws"` or `"nss"`    |
| 400    | Invalid request     | Malformed JSON body         | Verify JSON syntax        |
| 429    | Rate limit exceeded | Too many requests           | Wait 60 seconds and retry |

## Implementation Details

**File Location**: `src/app/api/tools/download-certificate/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `downloadCertificateInputSchema`
- Output: `downloadCertificateOutputSchema`

**Static Files**: `/public/assets/`

- `Omer_Akben_AWS_Certificate.pdf`
- `Omer_Akben_NSS_Certificate.pdf`

**Features**:

- ✅ Supports both GET (query params) and POST (JSON body)
- ✅ Zod schema validation
- ✅ Rich metadata (issuer, year, full certificate name)
- ✅ Google Drive fallback links for reliability
- ✅ File size metadata for UI progress indicators
- ✅ Server-side only (no client exposure)

## Related Tools

- [download_resume](download-resume.md) - Download resume in PDF format
- [get_contact](get-contact.md) - Retrieve contact information
- [list_projects](list-projects.md) - View Omer's project portfolio

## Changelog

- **2025-10-20**: Initial implementation with AWS and NSS certificates
- **2025-10-27**: Added Google Drive fallback URLs and rich metadata
