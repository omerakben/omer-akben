---
title: "trigger_workflow Tool"
description: "Trigger n8n workflow automation with optional result waiting and custom payload support"
date: 2025-11-02
status: mvp
tags: [api, tool, automation, workflow, n8n, integration]
---

# trigger_workflow Tool

Trigger workflow automation via n8n webhook integration with optional result waiting and custom payload support.

## Purpose

Enables AI assistant to trigger automated workflows for tasks like sending emails, updating databases, generating reports, or orchestrating multi-step processes. Currently returns mock responses for MVP. Future integration planned with n8n webhook endpoints for real workflow execution.

## Use Cases

- User asks "Send me an email summary of my projects"
- AI triggers automated report generation workflow
- Database updates triggered by conversation context
- Multi-step automation orchestration
- Scheduled task execution
- Third-party API integration workflows
- Data pipeline triggers

## Endpoint

```
GET  /api/tools/trigger-workflow
POST /api/tools/trigger-workflow
```

**Rate Limit**: 60 requests/minute (applies to all `/api/tools/*` endpoints)

**Environment Variable**: `N8N_WEBHOOK_URL` (optional for MVP, required for production)

## Input Schema

### Parameters

```typescript
{
  workflowId: string,           // Required
  waitForResult?: boolean,      // Optional, default: false
  payload?: Record<string, unknown>  // Optional, default: {}
}
```

| Parameter       | Type    | Required | Default | Description                                   |
| --------------- | ------- | -------- | ------- | --------------------------------------------- |
| `workflowId`    | string  | Yes      | -       | Unique identifier for the workflow to trigger |
| `waitForResult` | boolean | No       | false   | Wait for workflow completion before returning |
| `payload`       | object  | No       | {}      | Custom data to pass to workflow               |

### Validation Rules

- `workflowId` is required (non-empty string)
- `waitForResult` defaults to false (async execution)
- `payload` can contain any valid JSON data
- Payload size limit: 10KB (n8n webhook limit)

## Output Schema

### Success Response

```typescript
{
  success: true,
  data: {
    workflowId: string,        // Workflow identifier
    status: "queued" | "running" | "completed" | "failed",
    result?: {                 // Only present if waitForResult=true
      message: string,
      timestamp: string,
      [key: string]: unknown   // Custom workflow output
    },
    message: string            // Confirmation message
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: string                // Error message
}
```

## Examples

### Example 1: Trigger Workflow (Async, No Wait)

**Request (GET)**:

```bash
curl "http://localhost:3000/api/tools/trigger-workflow?workflowId=email-summary"
```

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{"workflowId": "email-summary"}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "workflowId": "email-summary",
    "status": "completed",
    "result": {
      "message": "Workflow executed successfully",
      "timestamp": "2025-11-02T14:30:00.000Z"
    },
    "message": "Workflow email-summary triggered successfully"
  }
}
```

### Example 2: Trigger with Custom Payload

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "send-email",
    "payload": {
      "to": "user@example.com",
      "subject": "Project Summary",
      "body": "Here are your AI projects..."
    }
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "workflowId": "send-email",
    "status": "completed",
    "result": {
      "message": "Workflow executed successfully",
      "timestamp": "2025-11-02T14:35:00.000Z"
    },
    "message": "Workflow send-email triggered successfully"
  }
}
```

### Example 3: Wait for Workflow Result

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "generate-report",
    "waitForResult": true,
    "payload": {
      "format": "pdf",
      "timeframe": "last-30-days"
    }
  }'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "workflowId": "generate-report",
    "status": "completed",
    "result": {
      "message": "Workflow executed successfully",
      "timestamp": "2025-11-02T14:40:00.000Z",
      "reportUrl": "https://storage.example.com/reports/2025-11-02.pdf",
      "pageCount": 15
    },
    "message": "Workflow generate-report triggered successfully"
  }
}
```

### Example 4: Missing Required Parameter

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Missing required parameter: workflowId"
}
```

### Example 5: Invalid Payload

**Request (POST)**:

```bash
curl -X POST http://localhost:3000/api/tools/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "test",
    "payload": "invalid-not-object"
  }'
```

**Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Payload must be an object"
}
```

## Workflow IDs

Common workflow identifiers (examples):

| Workflow ID          | Purpose                    | Payload Schema                                 |
| -------------------- | -------------------------- | ---------------------------------------------- |
| `email-summary`      | Send project summary email | `{ email: string }`                            |
| `generate-report`    | Generate PDF report        | `{ format: "pdf"\|"docx", timeframe: string }` |
| `update-crm`         | Update CRM contact         | `{ contactId: string, data: object }`          |
| `slack-notification` | Send Slack message         | `{ channel: string, message: string }`         |
| `database-sync`      | Sync data to database      | `{ table: string, records: array }`            |

## n8n Integration

### Setup (Future Implementation)

1. **n8n Installation**:

```bash
npm install -g n8n
n8n start
```

2. **Create Webhook Workflow**:

- Add "Webhook" trigger node
- Configure HTTP method: POST
- Copy webhook URL
- Add workflow logic nodes (email, database, API calls)

3. **Environment Configuration**:

```bash
# .env.local
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/unique-id
```

4. **Workflow Trigger**:

```typescript
// Future implementation
const response = await fetch(process.env.N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: 'email-summary',
    payload: { email: 'user@example.com' }
  })
});
```

### Workflow Design Patterns

**Pattern 1: Email Automation**:

```
Webhook Trigger → Filter Data → Compose Email → Send Email → Response
```

**Pattern 2: Database Sync**:

```
Webhook Trigger → Transform Data → Database Insert → Slack Notification → Response
```

**Pattern 3: Multi-Step Report**:

```
Webhook Trigger → Query Database → Generate Chart → Create PDF → Upload S3 → Send Email → Response
```

## Error Handling

### Common Errors

| Status | Error                     | Cause                           | Solution                                 |
| ------ | ------------------------- | ------------------------------- | ---------------------------------------- |
| 400    | Missing workflowId        | Required parameter not provided | Include workflowId in request            |
| 400    | Invalid payload           | Payload not a valid object      | Ensure payload is JSON object            |
| 400    | Payload too large         | Payload exceeds 10KB            | Reduce payload size                      |
| 429    | Rate limit exceeded       | Too many requests               | Wait 60 seconds and retry                |
| 500    | Workflow execution failed | n8n workflow error              | Check n8n logs, verify workflow          |
| 503    | n8n unavailable           | Cannot connect to n8n           | Verify N8N_WEBHOOK_URL, check n8n status |

## Implementation Details

**File Location**: `src/app/api/tools/trigger-workflow/route.ts`

**Schema Location**: `src/lib/agent-tools/schemas.ts`

- Input: `triggerWorkflowInputSchema`
- Output: `triggerWorkflowOutputSchema`

**Current Status**: MVP with mock responses

**Future Integration**:

- n8n webhook endpoint integration
- Real workflow execution with result streaming
- Workflow status polling
- Webhook authentication (API keys, signatures)
- Retry logic for failed workflows

**Features**:

- ✅ Workflow triggering via workflowId
- ✅ Custom payload support
- ✅ Optional result waiting
- ✅ Zod schema validation
- ⏳ Real n8n integration (planned)
- ⏳ Workflow status polling (planned)
- ⏳ Webhook authentication (planned)

## MVP vs Future Implementation

### Current (MVP)

```typescript
// Returns mock response
const mockResult = {
  workflowId,
  status: "completed" as const,
  result: {
    message: "Workflow executed successfully",
    timestamp: new Date().toISOString()
  },
  message: `Workflow ${workflowId} triggered successfully`
};
```

### Future (Planned)

```typescript
// Real n8n webhook integration
const webhookUrl = process.env.N8N_WEBHOOK_URL;

const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Workflow-ID': workflowId,
    'Authorization': `Bearer ${process.env.N8N_API_KEY}`
  },
  body: JSON.stringify(payload)
});

const result = await response.json();

return {
  workflowId,
  status: result.status,
  result: waitForResult ? result.data : undefined,
  message: `Workflow ${workflowId} triggered successfully`
};
```

## Security Considerations

- ✅ **Webhook URL Security**: Store N8N_WEBHOOK_URL in environment variables, never expose
- ✅ **Payload Validation**: Validate all payload data with Zod schemas
- ✅ **Rate Limiting**: Prevent abuse with 60 req/min limit
- ⏳ **Webhook Signatures**: Verify webhook authenticity (planned)
- ⏳ **API Key Authentication**: Secure n8n webhook access (planned)
- ⏳ **Payload Encryption**: Encrypt sensitive data in transit (planned)

## Performance Notes

- **MVP**: Instant response (<10ms) with mock data
- **Future (Async)**: 50-200ms webhook trigger time
- **Future (Sync)**: 1-30s depending on workflow complexity
- **Timeout**: 30s max for synchronous workflows (n8n default)
- **Retry Strategy**: Exponential backoff for failed webhooks

## Related Tools

- [collect_contact](collect-contact.md) - Email automation use case
- [profile_performance](profile-performance.md) - Performance monitoring workflow

## AI Assistant Usage

### Pattern 1: Email Automation

```typescript
// User asks: "Email me a summary of my AI projects"

// 1. Gather project data
const projects = await list_projects({ category: "ai-ml" });

// 2. Trigger email workflow
const result = await trigger_workflow({
  workflowId: "email-summary",
  payload: {
    email: "user@example.com",
    projects: projects.data.projects.map(p => ({
      name: p.title,
      description: p.description
    }))
  }
});

// AI Response: "I've sent an email summary of your 5 AI projects!"
```

### Pattern 2: Database Sync

```typescript
// AI detected high engagement, save contact to CRM

const result = await trigger_workflow({
  workflowId: "update-crm",
  payload: {
    source: "portfolio-chat",
    contact: {
      name: conversationContext.userName,
      engagement: conversationContext.messageCount,
      interests: conversationContext.topicsDiscussed
    }
  }
});
```

## Changelog

- **2025-10-20**: MVP implementation with mock responses
- **Future**: n8n webhook integration planned
- **Future**: Workflow status polling planned
- **Future**: Webhook authentication planned
