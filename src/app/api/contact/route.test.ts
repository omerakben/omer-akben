import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import * as rateLimit from "@/lib/rate-limit";

// Use vi.hoisted to ensure mockEmailsSend is available during module load
const { mockEmailsSend } = vi.hoisted(() => {
  return {
    mockEmailsSend: vi.fn(),
  };
});

// Mock Resend - must be before route import
vi.mock("resend", () => {
  class Resend {
    emails = {
      send: mockEmailsSend,
    };
  }
  return { Resend };
});

// Mock rate limit
vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return {
    ...actual,
    contactFormRateLimit: {
      limit: vi.fn(),
    },
  };
});

// Import route after mocking
import { POST } from "./route";

describe("POST /api/contact", () => {
  const validContactData = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "I would like to discuss a project with you. This is a valid message.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailsSend.mockClear();
    // Reset environment variables
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.OMER_EMAIL = "test@omerakben.com";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockRequest = (body: unknown, headers: Record<string, string> = {}) => {
    return {
      json: async () => body,
      headers: new Map(Object.entries({
        "content-type": "application/json",
        ...headers,
      })),
    } as unknown as NextRequest;
  };

  describe("Successful Submissions", () => {
    it("should send email successfully with valid data", async () => {
      // Mock rate limit success
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      // Mock Resend success
      mockEmailsSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = createMockRequest(validContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Email sent successfully");
    });

    it("should call Resend with correct parameters", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      mockEmailsSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = createMockRequest(validContactData);
      await POST(request);

      expect(mockEmailsSend).toHaveBeenCalledWith({
        from: "Omer Akben Portfolio <contact@omerakben.com>",
        to: "test@omerakben.com",
        replyTo: "john@example.com",
        subject: "Contact Form: Project Inquiry",
        react: expect.any(Object),
      });
    });

    it("should use environment variable for recipient email", async () => {
      process.env.OMER_EMAIL = "custom@email.com";

      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      mockEmailsSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = createMockRequest(validContactData);
      await POST(request);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "custom@email.com",
        })
      );
    });
  });

  describe("Rate Limiting", () => {
    it("should return 429 when rate limit exceeded", async () => {
      const resetTime = Date.now() + 86400000;
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: resetTime,
        pending: Promise.resolve(),
      });

      const request = createMockRequest(validContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Too many contact form submissions");
    });

    it("should include rate limit headers when limit exceeded", async () => {
      const resetTime = Date.now() + 86400000;
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: resetTime,
        pending: Promise.resolve(),
      });

      const request = createMockRequest(validContactData);
      const response = await POST(request);

      expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
      expect(response.headers.get("X-RateLimit-Reset")).toBe(
        new Date(resetTime).toISOString()
      );
      expect(response.headers.get("Retry-After")).toBeTruthy();
    });

    it("should extract IP from x-forwarded-for header", async () => {
      const limitSpy = vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      mockEmailsSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = createMockRequest(validContactData, {
        "x-forwarded-for": "192.168.1.1",
      });
      await POST(request);

      expect(limitSpy).toHaveBeenCalledWith("192.168.1.1");
    });

    it("should extract IP from x-real-ip header if x-forwarded-for not present", async () => {
      const limitSpy = vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      mockEmailsSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = createMockRequest(validContactData, {
        "x-real-ip": "10.0.0.1",
      });
      await POST(request);

      expect(limitSpy).toHaveBeenCalledWith("10.0.0.1");
    });

    it("should use 'anonymous' if no IP headers present", async () => {
      const limitSpy = vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      mockEmailsSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = createMockRequest(validContactData);
      await POST(request);

      expect(limitSpy).toHaveBeenCalledWith("anonymous");
    });
  });

  describe("Validation Errors", () => {
    it("should return 400 for missing name", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = { ...validContactData, name: "" };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Name is required");
    });

    it("should return 400 for invalid email", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = { ...validContactData, email: "invalid-email" };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid email address");
    });

    it("should return 400 for missing subject", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = { ...validContactData, subject: "" };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Subject is required");
    });

    it("should return 400 for message too short", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = { ...validContactData, message: "Short" };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Message must be at least 10 characters");
    });

    it("should return 400 for message too long", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = {
        ...validContactData,
        message: "a".repeat(5001),
      };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Message too long");
    });

    it("should return 400 for name too long", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = {
        ...validContactData,
        name: "a".repeat(101),
      };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Name too long");
    });

    it("should return 400 for subject too long", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const invalidData = {
        ...validContactData,
        subject: "a".repeat(201),
      };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Subject too long");
    });
  });

  describe("Resend API Errors", () => {
    it("should return 500 when Resend fails", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      mockEmailsSend.mockResolvedValueOnce({
        data: null,
        error: { message: "Resend API error", name: "ResendError" },
      });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = createMockRequest(validContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Failed to send email");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Resend Error:",
        expect.anything()
      );

      consoleErrorSpy.mockRestore();
    });

    it("should log Resend errors to console", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockResolvedValueOnce({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 86400000,
        pending: Promise.resolve(),
      });

      const resendError = { message: "API error", name: "ResendError" };
      mockEmailsSend.mockResolvedValueOnce({
        data: null,
        error: resendError,
      });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = createMockRequest(validContactData);
      await POST(request);

      expect(consoleErrorSpy).toHaveBeenCalledWith("Resend Error:", resendError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Unexpected Errors", () => {
    it("should return 500 for unexpected errors", async () => {
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockRejectedValueOnce(
        new Error("Unexpected error")
      );

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = createMockRequest(validContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("An unexpected error occurred");

      consoleErrorSpy.mockRestore();
    });

    it("should log unexpected errors to console", async () => {
      const testError = new Error("Test unexpected error");
      vi.mocked(rateLimit.contactFormRateLimit!.limit).mockRejectedValueOnce(
        testError
      );

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = createMockRequest(validContactData);
      await POST(request);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Contact API Error:",
        testError
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
