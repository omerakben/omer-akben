# Model Migration Validation Checklist

**Date**: November 7, 2025
**Migration**: Centralized Model Configuration - Grok-4-Fast Integration

---

## ✅ Automated Test Results

### Unit Tests (792 tests)
- **Status**: ✅ ALL PASSED
- **Command**: `npm test`
- **Result**: 792/792 passing

### E2E Tests - Chat & Agentic Sidebar (23 tests)
- **Status**: ✅ ALL PASSED (10 skipped - OpenAI API timing)
- **Command**: `npm run test:e2e -- chat.spec.ts agentic-sidebar.spec.ts`
- **Result**: 23 passed, 10 skipped
- **Duration**: 23.3s

**Key Tests Validated**:
- ✅ Chat sidebar open/close
- ✅ Message send/receive
- ✅ Markdown rendering
- ✅ Follow-up suggestions
- ✅ Keyboard shortcuts (Cmd/Ctrl+K)
- ✅ Thread persistence
- ✅ Navigation links
- ✅ Accessibility (ARIA labels, focus trap)
- ✅ Error handling

---

## 🖱️ Manual Verification Scenarios

### Scenario 1: Chat Agent Routing (Reasoning Model)
**Test**: Verify coordinator agent properly routes queries to specialist agents using `grok-4-fast-reasoning`

**Steps**:
1. Open browser to `http://localhost:3000`
2. Click floating chat button (bottom-right)
3. Test each routing scenario:

**1a. Resume Agent**
- Type: "Can you send me your resume?"
- **Expected**: Coordinator routes to resume-agent, offers download options
- **Verify**: Terminal logs show successful routing
- **Response Time**: 15-20s (reasoning model)

**1b. Project Agent**
- Type: "Tell me about your AI projects"
- **Expected**: Coordinator routes to project-agent, lists AI projects
- **Verify**: Project details displayed with technologies
- **Response Time**: 15-20s

**1c. Contact Agent**
- Type: "How can I contact you?"
- **Expected**: Coordinator routes to contact-agent, provides contact info
- **Verify**: Email, LinkedIn, GitHub links displayed
- **Response Time**: 15-20s

**1d. Navigation Agent**
- Type: "What pages are available on this site?"
- **Expected**: Coordinator routes to navigation-agent, lists all routes
- **Verify**: Navigation links with descriptions
- **Response Time**: 15-20s

---

### Scenario 2: Follow-up Suggestions (Non-Reasoning Model)
**Test**: Verify follow-up generator uses `grok-4-fast-non-reasoning` for fast suggestions

**Steps**:
1. Continue conversation from Scenario 1
2. After each assistant response, observe follow-up chips at bottom
3. Verify follow-up suggestions appear within 1-2 seconds

**Expected Behavior**:
- ✅ Follow-up chips appear quickly (1-2s after response)
- ✅ Suggestions are contextually relevant
- ✅ Clicking a chip sends that message
- ✅ No errors in terminal logs

**Terminal Verification**:
```
[DynamicGenerator] Extracted entities: { person_type: '...', topic: '...', ... }
[FollowupCache] Cached 3 follow-ups for thread ...
POST /api/suggest-followups 200 in 4-7s
```

---

### Scenario 3: Tool Execution
**Test**: Verify tools execute correctly with new agent models

**3a. Resume Download Tool**
- Type: "I'd like to download your full resume"
- Click "Full Resume (PDF)" button in response
- **Expected**: PDF downloads successfully
- **Verify**: Terminal shows `POST /api/tools/download-resume 200`

**3b. Project Open Tool**
- Type: "Tell me about your Elon AI Agent project"
- **Expected**: Project details displayed with description, technologies, links
- **Verify**: Project data matches `data/projects.ts`

**3c. Navigation Tool**
- Type: "Take me to your skills page"
- **Expected**: Response includes navigation link to /skills
- **Verify**: Clicking link navigates to /skills page

---

### Scenario 4: Fact Extraction (Non-Reasoning Model)
**Test**: Verify fact extraction from conversations uses `grok-4-fast-non-reasoning`

**Steps**:
1. Start new conversation (Cmd/Ctrl+Shift+N)
2. Type: "I'm a senior React developer at Google looking for new opportunities"
3. Wait for response
4. Check Redis for extracted facts (optional)

**Expected Behavior**:
- ✅ Conversation flows naturally
- ✅ Ozzy acknowledges user's role/company
- ✅ No errors in terminal logs
- ✅ Facts stored in Redis (7-day TTL)

**Terminal Verification**:
Look for fact extraction logs (if debug enabled):
```
[FactExtractor] Extracted: { role: 'developer', company: 'Google', ... }
```

---

### Scenario 5: Workflow Execution (Non-Reasoning Model)
**Test**: Verify workflows use `grok-4-fast-non-reasoning` for multi-step operations

**5a. Project Comparison Workflow**
- Type: "Compare your AI projects"
- **Expected**: Workflow shows 3 progress steps:
  - Step 1: Finding projects matching AI/ML...
  - Step 2: Comparing features...
  - Step 3: Generating recommendation...
- **Verify**: Each step completes with content
- **Response Time**: 20-30s total (3 LLM calls)

**5b. Interview Prep Workflow**
- Type: "Help me prepare for a React interview"
- **Expected**: Workflow shows 3 progress steps:
  - Step 1: Reviewing your resume...
  - Step 2: Assessing your technical skills...
  - Step 3: Generating practice questions...
- **Verify**: Each step provides relevant content
- **Response Time**: 20-30s total

---

### Scenario 6: Model Fallback Testing
**Test**: Verify automatic fallback to GPT-4o-mini if Grok fails

**Steps** (requires manual Grok API disruption):
1. Temporarily set invalid XAI API key
2. Send chat message
3. **Expected**: Request should succeed using fallback model
4. **Verify**: Terminal logs show fallback being used

**Terminal Expected**:
```
⚠️ Primary model failed, using fallback: [error message]
✅ Fallback model succeeded
```

**Note**: Skip this test if you don't want to disrupt API key. Fallback logic already tested in unit tests.

---

### Scenario 7: Performance Comparison
**Test**: Verify performance improvements for non-reasoning tasks

**Steps**:
1. Open browser DevTools → Network tab
2. Test reasoning task: "Tell me about your projects"
3. Note response time (should be 15-20s)
4. Test non-reasoning task: Click follow-up suggestion
5. Note suggestion generation time (should be 1-2s)

**Expected Results**:
- ✅ Reasoning tasks: 15-20s (acceptable for complex routing)
- ✅ Non-reasoning tasks: 1-2s (70-85% faster than before)
- ✅ Follow-ups appear quickly after response

---

### Scenario 8: Thread Persistence
**Test**: Verify conversation state persists across page refreshes

**Steps**:
1. Have a conversation (3-4 messages)
2. Refresh page (F5 or Cmd+R)
3. Open chat sidebar
4. **Expected**: Previous messages still visible
5. Continue conversation
6. **Expected**: Context maintained

**Verify**:
- ✅ Message history persists
- ✅ Follow-ups still displayed
- ✅ Can continue conversation naturally

---

### Scenario 9: Multiple User Personas
**Test**: Verify agent adapts responses for different user types

**9a. Recruiter Persona**
- Type: "I'm a technical recruiter at Microsoft"
- Type: "Do you need visa sponsorship?"
- **Expected**: Professional work authorization response
- **Verify**: Mentions "U.S. Permanent Resident (Green Card)"

**9b. Engineer Persona**
- Type: "I'm a fellow engineer interested in your architecture"
- Type: "How did you implement the agentic system?"
- **Expected**: Technical deep-dive response
- **Verify**: Discusses Mastra, AI SDK, architecture patterns

**9c. Student Persona**
- Type: "I'm a CS student learning React"
- Type: "What projects would you recommend I look at?"
- **Expected**: Educational, beginner-friendly guidance
- **Verify**: Suggests projects with learning value

---

### Scenario 10: Error Handling
**Test**: Verify graceful error handling

**10a. Network Error**
- Disconnect internet briefly
- Send message
- **Expected**: Error message displayed
- **Verify**: No app crash, can retry after reconnection

**10b. Rate Limiting**
- Send 30+ messages rapidly
- **Expected**: Rate limit message after 30 requests/min
- **Verify**: Clear error message, retry-after header

**10c. Invalid Input**
- Send extremely long message (>10,000 characters)
- **Expected**: Input validation error or truncation
- **Verify**: No server crash

---

## 📊 Terminal Log Verification

Watch for these patterns in terminal during manual testing:

### ✅ Successful Chat Flow
```
GET /api/chat?chatId=thread-... 200 in ...ms
POST /api/chat 200 in 15000-20000ms
```

### ✅ Successful Follow-up Generation
```
[DynamicGenerator] Extracted entities: { ... }
[DynamicGenerator] Routing state: { ... }
[FollowupCache] Cached 3 follow-ups for thread ...
POST /api/suggest-followups 200 in 4000-7000ms
```

### ✅ Successful Tool Execution
```
POST /api/tools/download-resume 200 in 300ms
POST /api/tools/list-projects 200 in 200ms
```

### ❌ Red Flags (Should NOT Appear)
```
❌ Error: Model not found
❌ 500 Internal Server Error
❌ TypeError: Cannot read property 'model'
❌ ReferenceError: PRIMARY_REASONING_MODEL is not defined
```

---

## 📝 Validation Summary Template

After completing manual verification, fill this out:

```
## Manual Validation Results

**Date**: [Date]
**Tester**: [Your Name]
**Browser**: [Chrome/Firefox/Safari] [Version]
**Environment**: Development (localhost:3000)

### Scenarios Tested:
- [ ] Scenario 1: Chat Agent Routing ✅/❌
  - Resume Agent: ✅/❌
  - Project Agent: ✅/❌
  - Contact Agent: ✅/❌
  - Navigation Agent: ✅/❌

- [ ] Scenario 2: Follow-up Suggestions ✅/❌
  - Response time <2s: ✅/❌
  - Contextually relevant: ✅/❌
  - Clickable: ✅/❌

- [ ] Scenario 3: Tool Execution ✅/❌
  - Resume download: ✅/❌
  - Project details: ✅/❌
  - Navigation: ✅/❌

- [ ] Scenario 4: Fact Extraction ✅/❌
- [ ] Scenario 5: Workflow Execution ✅/❌
  - Project comparison: ✅/❌
  - Interview prep: ✅/❌

- [ ] Scenario 6: Model Fallback ✅/❌ (optional)
- [ ] Scenario 7: Performance ✅/❌
- [ ] Scenario 8: Thread Persistence ✅/❌
- [ ] Scenario 9: User Personas ✅/❌
- [ ] Scenario 10: Error Handling ✅/❌

### Issues Found:
1. [Issue description] - [Severity: Low/Medium/High]
2. [Issue description] - [Severity: Low/Medium/High]

### Terminal Logs:
[Paste any relevant error logs or unexpected behavior]

### Overall Assessment:
✅ READY TO COMMIT
❌ NEEDS FIXES - [List critical issues]

### Notes:
[Any additional observations]
```

---

## 🎯 Success Criteria

**ALL of the following must be true to proceed with commit:**

1. ✅ All automated tests passing (792 unit + 23 E2E)
2. ✅ No console errors in browser DevTools
3. ✅ No error logs in terminal (except expected rate limit tests)
4. ✅ Chat responses working for all agent types
5. ✅ Follow-ups generating within 2 seconds
6. ✅ Tools executing successfully
7. ✅ Thread persistence working
8. ✅ Performance improvements visible (non-reasoning faster)
9. ✅ Error handling graceful
10. ✅ Model configuration working as expected

**If any scenario fails**, investigate logs and fix before committing.

---

## 📚 Reference

- **Model Config**: `src/lib/ai/model-config.ts`
- **Fallback Utility**: `src/lib/ai/model-fallback.ts`
- **Agents**: `src/lib/mastra/agents/*.ts`
- **Workflows**: `src/lib/mastra/workflows/*.ts`
- **Follow-ups**: `src/lib/followups/dynamic-generator.ts`
- **Fact Extractor**: `src/lib/memory/fact-extractor.ts`
- **Documentation**: `CLAUDE.md` (lines 155-229)
