/**
 * Unit tests for Collect Contact API Route
 * Tests contact collection, validation, and email sending
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import {
  createMockRequest,
  getResponseJson,
  isSuccessResponse,
  isErrorResponse,
} from '../test-utils';

// Mock external dependencies
vi.mock('@/lib/email/send-zoom-link', () => ({
  sendZoomLinkEmail: vi.fn().mockResolvedValue({
    success: true,
    messageId: 'test-message-id',
  }),
}));

vi.mock('@/lib/redis/contact-storage', () => ({
  saveContactToRedis: vi.fn().mockResolvedValue(undefined),
  getContactFromRedis: vi.fn().mockResolvedValue(null),
  hasCollectedContact: vi.fn().mockResolvedValue(false),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkContactRateLimit: vi.fn().mockResolvedValue(true),
}));

describe('POST /api/tools/collect-contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid requests', () => {
    it('should collect contact with all fields', async () => {
      const req = createMockRequest({
        name: 'Jane Smith',
        email: 'jane@acme.com',
        company: 'Acme Corp',
        purpose: 'hire',
        notes: 'Interested in AI engineering role',
        preferredTime: 'Next week',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as {
          success: boolean;
          emailSent: boolean;
          zoomLink?: string;
          message: string;
        };
        expect(data.success).toBe(true);
        expect(data.emailSent).toBe(true);
        expect(data.zoomLink).toBeDefined();
        expect(data.message).toContain('jane@acme.com');
      }
    });

    it('should collect contact with minimum required fields', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        purpose: 'collaborate',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it('should accept all valid purpose values', async () => {
      const purposes = ['hire', 'collaborate', 'interview', 'consult', 'other'];

      for (const purpose of purposes) {
        const req = createMockRequest({
          name: 'Test User',
          email: 'test@example.com',
          purpose,
        });

        const response = await POST(req);
        const json = await getResponseJson(response);

        expect(response.status).toBe(200);
        expect(isSuccessResponse(json)).toBe(true);
      }
    });

    it('should return Zoom link in response', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { zoomLink?: string };
        expect(data.zoomLink).toBeDefined();
        expect(data.zoomLink).toMatch(/zoom\.us/);
      }
    });
  });

  describe('Invalid requests', () => {
    it('should reject missing name', async () => {
      const req = createMockRequest({
        email: 'test@example.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it('should reject missing email', async () => {
      const req = createMockRequest({
        name: 'Test User',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it('should reject missing purpose', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'invalid-email',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it('should reject disposable email addresses', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@tempmail.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        expect(json.error).toContain('Disposable email');
      }
    });

    it('should reject name that is too short', async () => {
      const req = createMockRequest({
        name: 'A',
        email: 'test@example.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it('should reject name that is too long', async () => {
      const req = createMockRequest({
        name: 'A'.repeat(101),
        email: 'test@example.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it('should reject invalid purpose value', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'invalid',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe('Field validation', () => {
    it('should accept company as optional field', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
        company: 'Test Corp',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it('should accept notes as optional field', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
        notes: 'Looking for full-time position',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it('should accept preferredTime as optional field', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
        preferredTime: 'Monday afternoon',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it('should reject notes that are too long', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
        notes: 'A'.repeat(501),
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe('Response structure', () => {
    it('should include all required response fields', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as Record<string, unknown>;
        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('emailSent');
        expect(data).toHaveProperty('zoomLink');
        expect(data).toHaveProperty('message');
      }
    });

    it('should return user-friendly success message', async () => {
      const req = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        purpose: 'hire',
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { message: string };
        expect(data.message).toBeTruthy();
        expect(data.message.length).toBeGreaterThan(10);
      }
    });
  });
});
