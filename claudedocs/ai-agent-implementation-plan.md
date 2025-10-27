# AI Agent Implementation Plan - Portfolio Chatbot

**Date**: 2025-10-17
**Project**: omerakben.com Portfolio AI Agent
**Purpose**: Intelligent chatbot for recruiters and employers with autonomous email capabilities

---

## Executive Summary

Transform the portfolio from static to **conversational** with an AI agent that:

- Answers interview-style questions naturally ("Tell me about yourself", "What's your experience?")
- Proactively recommends actions (schedule calls, send emails)
- **Autonomously sends conversation summaries** to visitors and Omer
- Targets recruiters and employers with career-focused conversation flows

---

## 1. Technology Stack Recommendation

### **Primary Framework: Vercel AI SDK + OpenAI**

**Why This Stack?**

- ✅ **Native Next.js Integration**: Already using Next.js 15
- ✅ **Developer-Friendly**: Fastest implementation path
- ✅ **Modern Architecture**: Edge-optimized, React streaming
- ✅ **Tool Calling Support**: Built-in support for autonomous actions

**Architecture**:

```
Visitor → Chat UI (React) → Vercel AI SDK → OpenAI GPT-4o → Tools
                                                              ├─ Email Tool (Resend)
                                                              ├─ Calendar Tool (Cal.com)
                                                              └─ Data Retrieval (facts.ts)
```

### **Components**

| Component          | Technology                                | Purpose                                 |
| ------------------ | ----------------------------------------- | --------------------------------------- |
| **Chat Interface** | Vercel AI SDK + shadcn/ui Chat components | User-facing chat UI                     |
| **AI Model**       | OpenAI GPT-4o (via Vercel AI SDK)         | Natural conversation, reasoning         |
| **Email Service**  | Resend                                    | Send conversation summaries, follow-ups |
| **Scheduling**     | Cal.com API                               | Schedule calls with Omer                |
| **Data Source**    | src/data/facts.ts                         | Portfolio information, grounding data   |
| **Storage**        | Vercel KV (Redis)                         | Conversation history, session state     |

---

## 2. Conversation Flow Design

### **Conversation Stages**

**Stage 1: Greeting & Context Gathering (0-2 messages)**

```
Agent: "Hi! I'm Ozzy, Omer's AI assistant. I can answer questions about his background,
       projects, and experience. Are you a recruiter, hiring manager, or just exploring?"

[Conditional branching based on response]
```

**Stage 2: Q&A Session (3-10 messages)**

```
Recruiter: "Tell me about Omer's AI experience"
Agent: [Retrieves from facts.ts] "Omer has 2+ years of AI/ML engineering experience,
       specializing in GenAI/LLM applications with OpenAI Responses API and LangGraph.
       He's built 15+ workflow automations with 90% test coverage..."

Recruiter: "What's his most impressive project?"
Agent: [Retrieves from projects.ts] "His standout project is the DEADLINE capstone app -
       a task orchestration platform with voice AI agent..."
```

**Stage 3: Proactive Engagement (After 5+ quality exchanges)**

```
Agent: "You seem interested! Would you like me to:
       1. 📧 Email you a summary of this conversation
       2. 📅 Schedule a call with Omer (he's available for interviews)
       3. 📄 Send you his resume and portfolio links"
```

**Stage 4: Action Execution**

```
Recruiter: "Yes, send me the summary and let's schedule a call"
Agent: [Triggers email tool] ✓ Email sent to recruiter@company.com
       [Triggers calendar tool] "Great! Omer has availability on..."
```

**Stage 5: Follow-up (Autonomous)**

```
[After conversation ends]
→ Email to Recruiter: Conversation summary + Resume + Cal.com link
→ Email to Omer: "New recruiter conversation from [Company]. Summary: ..."
```

---

## 3. Email Automation Architecture

### **Email Templates**

**Template 1: Conversation Summary to Visitor**

```
Subject: Your conversation with Omer Akben's AI Assistant

Hi [Name],

Thanks for chatting with me! Here's a summary of our conversation:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONVERSATION SUMMARY

[AI-generated summary of key topics discussed]

Questions Asked:
• [Question 1]
• [Question 2]
• [Question 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📎 RESOURCES

📄 Resume: [Link to PDF]
💼 LinkedIn: https://linkedin.com/in/omerakben
🌐 Portfolio: https://omerakben.com
📅 Schedule a Call: [Cal.com link]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Ozzy (Omer's AI Assistant)
```

**Template 2: New Conversation Alert to Omer**

```
Subject: 🎯 New Recruiter Conversation - [Company Name]

Hi Omer,

You have a new conversation from a potential recruiter!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 VISITOR INFORMATION

Email: [recruiter@company.com]
Company: [Company Name] (if detected)
Role: [Recruiter/Hiring Manager]
Engagement Level: ★★★★☆ (High Interest)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 CONVERSATION SUMMARY

[AI-generated summary]

Key Topics:
• [Topic 1]
• [Topic 2]

Actions Taken:
✓ Sent conversation summary to visitor
✓ Provided resume and Cal.com link
⏳ Awaiting call scheduling

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SENTIMENT ANALYSIS

Overall: Positive
Interest Level: High
Next Step: Follow up within 24h

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 QUICK ACTIONS

View full conversation: [Dashboard link]
```

### **Email Service: Resend Integration**

**Why Resend?**

- Modern, developer-friendly API
- React Email template support
- Native Next.js integration
- Excellent deliverability
- Affordable pricing ($20/mo for 50k emails)

**Implementation**:

```typescript
// src/lib/email/resend-client.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConversationSummary(
  to: string,
  summary: string,
  conversationId: string
) {
  await resend.emails.send({
    from: 'Ozzy <ozzy@omerakben.com>',
    to,
    subject: 'Your conversation with Omer Akben\'s AI Assistant',
    html: generateSummaryEmail(summary, conversationId),
  });
}

export async function notifyOmer(
  recruiterEmail: string,
  company: string,
  summary: string,
  sentiment: string
) {
  await resend.emails.send({
    from: 'Portfolio Bot <bot@omerakben.com>',
    to: 'akbenof@gmail.com',
    subject: `🎯 New Recruiter Conversation - ${company}`,
    html: generateOwnerNotification({
      recruiterEmail,
      company,
      summary,
      sentiment
    }),
  });
}
```

---

## 4. Implementation Roadmap

### **Phase 1: Foundation (Week 1)**

**Tasks**:

- [ ] Install Vercel AI SDK (`npm install ai`)
- [ ] Set up OpenAI API integration
- [ ] Create chat UI component (shadcn/ui based)
- [ ] Implement basic Q&A using facts.ts as context
- [ ] Test conversation flow

**Files to Create**:

```
src/app/chat/page.tsx                 # Chat page
src/components/chat/chat-interface.tsx # Chat UI component
src/lib/ai/openai-client.ts           # OpenAI setup
src/lib/ai/conversation-context.ts    # Conversation state management
```

**Expected Outcome**: Working chat that answers questions about Omer

---

### **Phase 2: Email Automation (Week 2)**

**Tasks**:

- [ ] Sign up for Resend account
- [ ] Create email templates (React Email)
- [ ] Implement email sending tools
- [ ] Add "send summary" tool to AI agent
- [ ] Test email delivery

**Files to Create**:

```
src/lib/email/resend-client.ts        # Resend integration
src/lib/email/templates/              # Email templates
  ├─ visitor-summary.tsx              # Visitor email template
  └─ owner-notification.tsx           # Omer notification template
src/lib/ai/tools/email-tool.ts        # Email tool for AI agent
```

**Environment Variables**:

```env
RESEND_API_KEY=re_...
OMER_EMAIL=akbenof@gmail.com
```

**Expected Outcome**: Agent can autonomously send emails

---

### **Phase 3: Proactive Engagement (Week 3)**

**Tasks**:

- [ ] Implement conversation stage detection
- [ ] Add proactive recommendation logic
- [ ] Create calendar integration (Cal.com)
- [ ] Add "schedule call" tool
- [ ] Implement sentiment analysis

**Files to Create**:

```
src/lib/ai/conversation-analyzer.ts   # Detect conversation stage
src/lib/ai/tools/calendar-tool.ts     # Cal.com integration
src/lib/ai/sentiment.ts               # Basic sentiment analysis
```

**Expected Outcome**: Agent proactively offers scheduling after quality conversations

---

### **Phase 4: Storage & Analytics (Week 4)**

**Tasks**:

- [ ] Set up Vercel KV for conversation storage
- [ ] Store all conversations with metadata
- [ ] Create admin dashboard for reviewing conversations
- [ ] Add analytics (engagement metrics, conversion rates)
- [ ] GDPR compliance (consent, data deletion)

**Files to Create**:

```
src/lib/storage/kv-client.ts          # Vercel KV integration
src/app/admin/conversations/page.tsx  # Admin dashboard
src/lib/analytics/metrics.ts          # Conversation analytics
```

**Expected Outcome**: Full conversation history and insights dashboard

---

## 5. Code Examples

### **Example 1: Chat Page with Vercel AI SDK**

```typescript
// src/app/chat/page.tsx
'use client';

import { useChat } from 'ai/react';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="container max-w-4xl py-8">
      <ChatInterface
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
```

### **Example 2: AI Chat API Route with Tools**

```typescript
// src/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { sendConversationSummary, notifyOmer } from '@/lib/email/resend-client';
import { facts } from '@/data/facts';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are Ozzy, Omer Akben's AI assistant. You help recruiters and employers
learn about Omer's background, projects, and experience. Be professional, friendly,
and proactive in offering to send summaries or schedule calls.

OMER'S INFORMATION:
${JSON.stringify(facts, null, 2)}

CONVERSATION GUIDELINES:
- Answer questions naturally using the provided information
- After 5+ meaningful exchanges, proactively ask if they want a summary email
- Detect recruiter intent and offer to schedule calls
- Be concise but informative`,
    tools: {
      sendSummaryEmail: tool({
        description: 'Send conversation summary email to visitor and notify Omer',
        parameters: z.object({
          visitorEmail: z.string().email(),
          visitorName: z.string().optional(),
          company: z.string().optional(),
        }),
        execute: async ({ visitorEmail, visitorName, company }) => {
          // Generate summary from conversation
          const summary = generateSummary(messages);

          // Send to visitor
          await sendConversationSummary(visitorEmail, summary, 'conv_123');

          // Notify Omer
          await notifyOmer(
            visitorEmail,
            company || 'Unknown Company',
            summary,
            'positive'
          );

          return {
            success: true,
            message: `✓ Summary sent to ${visitorEmail} and Omer notified!`
          };
        },
      }),

      scheduleCall: tool({
        description: 'Provide Cal.com scheduling link',
        parameters: z.object({
          visitorEmail: z.string().email(),
        }),
        execute: async ({ visitorEmail }) => {
          return {
            calLink: 'https://cal.com/omerakben/30min',
            message: 'Here\'s the scheduling link: https://cal.com/omerakben/30min'
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

function generateSummary(messages: any[]): string {
  // Use GPT-4 to generate concise summary
  // Implementation details...
  return 'Conversation summary...';
}
```

### **Example 3: Email Template (React Email)**

```typescript
// src/lib/email/templates/visitor-summary.tsx
import { Html, Head, Body, Container, Section, Text, Link } from '@react-email/components';

interface VisitorSummaryProps {
  visitorName?: string;
  summary: string;
  topicsDiscussed: string[];
}

export function VisitorSummaryEmail({
  visitorName,
  summary,
  topicsDiscussed
}: VisitorSummaryProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>
            {visitorName ? `Hi ${visitorName}` : 'Hi there'},
          </Text>

          <Text style={paragraph}>
            Thanks for chatting with me! Here's a summary of our conversation:
          </Text>

          <Section style={summaryBox}>
            <Text style={summaryText}>{summary}</Text>
          </Section>

          <Text style={subheading}>Topics Discussed:</Text>
          {topicsDiscussed.map((topic, i) => (
            <Text key={i} style={bulletPoint}>• {topic}</Text>
          ))}

          <Section style={resourcesBox}>
            <Text style={subheading}>📎 Resources</Text>
            <Link href="https://omerakben.com/assets/Omer_Akben_Resume.pdf" style={link}>
              📄 Download Resume (PDF)
            </Link>
            <Link href="https://linkedin.com/in/omerakben" style={link}>
              💼 LinkedIn Profile
            </Link>
            <Link href="https://cal.com/omerakben/30min" style={link}>
              📅 Schedule a Call
            </Link>
          </Section>

          <Text style={footer}>
            Best regards,<br />
            Ozzy (Omer's AI Assistant)
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Inter, sans-serif' };
const container = { margin: '0 auto', padding: '20px', maxWidth: '600px' };
const heading = { fontSize: '24px', fontWeight: 'bold', color: '#0b1328' };
// ... more styles
```

---

## 6. Privacy & GDPR Compliance

### **Requirements**

**Must-Have Features**:

- [ ] Cookie consent banner before chat initialization
- [ ] Clear privacy policy link in chat interface
- [ ] Opt-in for email communication
- [ ] Data deletion request handling
- [ ] Conversation transcript access for users
- [ ] Anonymized analytics (no PII in tracking)

**Implementation**:

```typescript
// Before sending any email, get explicit consent
const consent = await getVisitorConsent(visitorEmail);
if (!consent.email) {
  return 'I need your permission to send emails. Would you like to opt-in?';
}
```

**Privacy Policy Updates**:

- Add section on AI chatbot data collection
- Explain conversation storage (30 days, then anonymized)
- Detail email automation and opt-out process
- Provide data deletion request form

---

## 7. Success Metrics

**Key Performance Indicators (KPIs)**:

| Metric                    | Target                  | Measurement                        |
| ------------------------- | ----------------------- | ---------------------------------- |
| **Engagement Rate**       | >40% of visitors engage | Chat opens / Total visitors        |
| **Quality Conversations** | >5 messages             | Conversations with 5+ exchanges    |
| **Email Capture Rate**    | >25%                    | Emails collected / Total chats     |
| **Call Scheduling Rate**  | >10%                    | Scheduled calls / Total chats      |
| **Recruiter Conversion**  | >5%                     | Recruiter convos / Total chats     |
| **Sentiment Score**       | >4.0/5.0                | AI-analyzed conversation sentiment |

**Analytics Dashboard**:

```
📊 PORTFOLIO AI AGENT ANALYTICS

Total Conversations: 342
└─ Recruiter Conversations: 87 (25%)
└─ Quality Conversations (5+ msgs): 156 (46%)

Conversions:
├─ Emails Captured: 92 (27%)
├─ Calls Scheduled: 18 (5%)
└─ Resume Downloads: 134 (39%)

Top Questions:
1. "Tell me about AI/ML experience" (67x)
2. "What's your most impressive project?" (54x)
3. "Are you open to relocation?" (41x)
```

---

## 8. Cost Estimate

**Monthly Operational Costs**:

| Service    | Tier                           | Cost            |
| ---------- | ------------------------------ | --------------- |
| OpenAI API | GPT-4o @ ~10k conversations/mo | ~$150           |
| Resend     | 50k emails/mo                  | $20             |
| Vercel KV  | 1GB storage                    | $0 (Free tier)  |
| Cal.com    | Basic                          | $0 (Free tier)  |
| **Total**  |                                | **~$170/month** |

**Cost Optimization**:

- Use GPT-4o-mini for simple Q&A ($0.15 vs $5 per 1M tokens)
- Cache conversation context to reduce API calls
- Rate limit chat to 20 messages per conversation

---

## 9. Next Steps

**Immediate Actions**:

1. **Create Technical Specification** (1 day)
   - Detailed API design for chat endpoint
   - Database schema for conversation storage
   - Email template specifications

2. **Set Up Development Environment** (1 day)
   - Install Vercel AI SDK
   - Set up OpenAI API key
   - Create Resend account and configure domain

3. **Build MVP Chat Interface** (3 days)
   - Basic chat UI with shadcn/ui components
   - OpenAI integration with facts.ts grounding
   - Test Q&A functionality

4. **Implement Email Automation** (2 days)
   - Email tool integration
   - Template creation
   - Test email delivery

5. **Add Proactive Features** (2 days)
   - Conversation stage detection
   - Scheduling integration
   - Sentiment analysis

**Total MVP Timeline**: 2 weeks

---

## 10. Recommended Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     VISITOR FLOW                            │
└─────────────────────────────────────────────────────────────┘

Visitor visits omerakben.com
        │
        ├─ Sees chat widget (shadcn/ui)
        │
        ├─ Starts conversation
        │       │
        │       ▼
        │   [Chat Interface]
        │       │
        │       ├─ User: "Tell me about yourself"
        │       │
        │       ▼
        │   [POST /api/chat]
        │       │
        │       ├─ Vercel AI SDK
        │       ├─ OpenAI GPT-4o
        │       ├─ Context: facts.ts + projects.ts
        │       │
        │       ▼
        │   Agent Response: "I'm Omer's AI assistant..."
        │
        ├─ After 5+ quality exchanges
        │       │
        │       ▼
        │   Agent: "Would you like me to email you a summary?"
        │       │
        │       ├─ Visitor: "Yes, please"
        │       │
        │       ▼
        │   [Tool: sendSummaryEmail]
        │       │
        │       ├─ Collect email with consent
        │       ├─ Generate summary (GPT-4)
        │       │
        │       ▼
        │   [Resend API]
        │       │
        │       ├─ Email to visitor (summary + resources)
        │       ├─ Email to Omer (notification + lead info)
        │       │
        │       ▼
        │   [Vercel KV Storage]
        │       │
        │       ├─ Store conversation
        │       ├─ Store visitor email
        │       └─ Store engagement metrics
        │
        └─ Conversation ends
```

---

## Conclusion

This implementation plan provides a **production-ready roadmap** for transforming your portfolio into an intelligent, conversational experience that actively engages recruiters and converts visitors into opportunities.

**Key Strengths**:

- ✅ Modern, scalable architecture
- ✅ Autonomous email workflows
- ✅ GDPR-compliant data handling
- ✅ Measurable ROI with analytics
- ✅ Low operational costs (~$170/mo)

**Start with the MVP** (2 weeks), then iterate based on real recruiter feedback and analytics.
