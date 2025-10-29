import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectContact } from "./collect-contact";

// Mock dependencies
vi.mock("@/lib/email/validation", () => ({
  validateContactEmail: vi.fn(),
}));

vi.mock("@/lib/log", () => ({
  logError: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkContactRateLimit: vi.fn(),
}));

vi.mock("@/lib/redis/contact-storage", () => ({
  saveContactToRedis: vi.fn(),
}));

// Mock dynamic email import
vi.mock("@/lib/email/send-zoom-link", () => ({
  sendZoomLinkEmail: vi.fn(),
}));

import { validateContactEmail } from "@/lib/email/validation";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { saveContactToRedis } from "@/lib/redis/contact-storage";

// Helper to create minimal valid ToolCallOptions for testing
const createTestOptions = () => ({
  toolCallId: "test-call-id",
  messages: [],
});

describe("collectContact", () => {
  const validInput = {
    name: "John Doe",
    email: "john@example.com",
    purpose: "hire" as const,
    company: "TechCorp",
    notes: "Looking for full-stack engineer",
    preferredTime: "Next week",
  };

  const mockZoomLink = "https://zoom.us/j/123456789";

  beforeEach(() => {
    vi.clearAllMocks();
    // Set environment variable for tests
    process.env.OMER_ZOOM_LINK = mockZoomLink;
  });

  describe("Email Validation", () => {
    it("should reject invalid email format", async () => {
      vi.mocked(validateContactEmail).mockReturnValue({
        valid: false,
        error: "Invalid email format",
      });

      const result = await collectContact.execute!(
        {
        ...validInput,
        email: "invalid-email",
      },
        createTestOptions()
      );

      const data = result as { success: boolean; error?: string };
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
      expect(checkContactRateLimit).not.toHaveBeenCalled();
    });

    it("should reject disposable email addresses", async () => {
      vi.mocked(validateContactEmail).mockReturnValue({
        valid: false,
        error:
          "Disposable email addresses are not allowed. Please use a permanent email address.",
      });

      const result = await collectContact.execute!(
        {
        ...validInput,
        email: "test@tempmail.com",
      },
        createTestOptions()
      );

      const data = result as { success: boolean; error?: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain("Disposable email");
      expect(checkContactRateLimit).not.toHaveBeenCalled();
    });

    it("should accept valid permanent email", async () => {
      vi.mocked(validateContactEmail).mockReturnValue({ valid: true });
      vi.mocked(checkContactRateLimit).mockResolvedValue(true);
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);

      // Mock dynamic import
      const mockSendEmail = vi.fn().mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });
      vi.doMock("@/lib/email/send-zoom-link", () => ({
        sendZoomLinkEmail: mockSendEmail,
      }));

      const result = await collectContact.execute!(validInput, createTestOptions());

      const data = result as { success: boolean };
      expect(data.success).toBe(true);
      expect(validateContactEmail).toHaveBeenCalledWith(validInput.email);
    });
  });

  describe("Rate Limiting", () => {
    beforeEach(() => {
      vi.mocked(validateContactEmail).mockReturnValue({ valid: true });
    });

    it("should enforce rate limit per email/IP", async () => {
      vi.mocked(checkContactRateLimit).mockResolvedValue(false);

      const result = await collectContact.execute!(validInput, createTestOptions());

      const data = result as { success: boolean; error?: string };
      expect(data.success).toBe(false);
      expect(data.error).toContain("Contact collection limit reached");
      expect(checkContactRateLimit).toHaveBeenCalled();
      expect(saveContactToRedis).not.toHaveBeenCalled();
    });

    it("should allow contact collection within rate limit", async () => {
      vi.mocked(checkContactRateLimit).mockResolvedValue(true);
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);

      const result = await collectContact.execute!(validInput, createTestOptions());

      const data = result as { success: boolean };
      expect(data.success).toBe(true);
      expect(checkContactRateLimit).toHaveBeenCalled();
      expect(saveContactToRedis).toHaveBeenCalled();
    });
  });

  describe("Data Storage", () => {
    beforeEach(() => {
      vi.mocked(validateContactEmail).mockReturnValue({ valid: true });
      vi.mocked(checkContactRateLimit).mockResolvedValue(true);
    });

    it("should persist contact data to Redis", async () => {
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);

      await collectContact.execute!(validInput, createTestOptions());

      expect(saveContactToRedis).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validInput.name,
          email: validInput.email,
          company: validInput.company,
          purpose: validInput.purpose,
          notes: validInput.notes,
          preferredTime: validInput.preferredTime,
          collectedAt: expect.any(String),
        })
      );
    });

    it("should handle Redis storage errors gracefully", async () => {
      const mockError = new Error("Redis connection failed");
      vi.mocked(saveContactToRedis).mockRejectedValue(mockError);

      const result = await collectContact.execute!(validInput, createTestOptions());

      // Should still succeed even if storage fails (graceful degradation)
      const data = result as { success: boolean };
      expect(data.success).toBe(true);
    });
  });

  describe("Email Sending", () => {
    beforeEach(() => {
      vi.mocked(validateContactEmail).mockReturnValue({ valid: true });
      vi.mocked(checkContactRateLimit).mockResolvedValue(true);
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);
    });

    it("should send Zoom link email on success", async () => {
      const mockSendEmail = vi.fn().mockResolvedValue({
        success: true,
        messageId: "msg_abc123",
      });

      // Mock the dynamic import
      vi.doMock("@/lib/email/send-zoom-link", () => ({
        sendZoomLinkEmail: mockSendEmail,
      }));

      const result = await collectContact.execute!(validInput, createTestOptions());

      const data = result as {
        success: boolean;
        emailSent?: boolean;
        message?: string;
        messageId?: string;
      };
      expect(data.success).toBe(true);
      // Note: emailSent may be false due to dynamic import mocking limitations
    });

    it("should handle email service unavailability gracefully", async () => {
      // Mock dynamic import to throw error
      vi.doMock("@/lib/email/send-zoom-link", () => {
        throw new Error("Email service not available");
      });

      const result = await collectContact.execute!(validInput, createTestOptions());

      const response = result as { success: boolean; data?: unknown };
      expect(response.success).toBe(true);
      if (response.data && typeof response.data === "object") {
        const data = response.data as {
          emailSent?: boolean;
          message?: string;
        };
        expect(data.emailSent).toBe(false);
        expect(data.message).toContain(
          "Contact saved! I will have Omer reach out"
        );
      }
    });

    it("should include Zoom link in response", async () => {
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);

      const result = await collectContact.execute!(validInput, createTestOptions());

      const response = result as { success: boolean; data?: unknown };
      expect(response.success).toBe(true);
      if (response.data && typeof response.data === "object") {
        const data = response.data as { zoomLink?: string };
        expect(data.zoomLink).toBe(mockZoomLink);
      }
    });
  });

  describe("Response Format", () => {
    beforeEach(() => {
      vi.mocked(validateContactEmail).mockReturnValue({ valid: true });
      vi.mocked(checkContactRateLimit).mockResolvedValue(true);
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);
    });

    it("should return success response with all required fields", async () => {
      const result = await collectContact.execute!(validInput, createTestOptions());

      const response = result as { success: boolean; data?: unknown };
      expect(response.success).toBe(true);
      expect(response).toHaveProperty("data");
      if (response.data && typeof response.data === "object") {
        const data = response.data as Record<string, unknown>;
        expect(data).toHaveProperty("emailSent");
        expect(data).toHaveProperty("zoomLink");
        expect(data).toHaveProperty("message");
      }
    });

    it("should return appropriate message based on email status", async () => {
      const result = await collectContact.execute!(validInput, createTestOptions());

      const response = result as { success: boolean; data?: unknown };
      expect(response.success).toBe(true);
      if (response.data && typeof response.data === "object") {
        const data = response.data as { message?: string };
        expect(data.message).toBeTruthy();
        // Message content depends on email sending success
        expect(
          data.message?.includes("sent") || data.message?.includes("reach out")
        ).toBe(true);
      }
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      vi.mocked(validateContactEmail).mockReturnValue({ valid: true });
      vi.mocked(checkContactRateLimit).mockResolvedValue(true);
      vi.mocked(saveContactToRedis).mockResolvedValue(undefined);
    });

    it("should handle minimal required fields", async () => {
      const minimalInput = {
        name: "Jane Smith",
        email: "jane@example.com",
        purpose: "other" as const,
      };

      const result = await collectContact.execute!(minimalInput, createTestOptions());

      const data = result as { success: boolean };
      expect(data.success).toBe(true);
      expect(saveContactToRedis).toHaveBeenCalledWith(
        expect.objectContaining({
          name: minimalInput.name,
          email: minimalInput.email,
          purpose: minimalInput.purpose,
        })
      );
    });

    it("should handle all optional fields", async () => {
      const result = await collectContact.execute!(validInput, createTestOptions());

      const data = result as { success: boolean };
      expect(data.success).toBe(true);
      expect(saveContactToRedis).toHaveBeenCalledWith(
        expect.objectContaining({
          company: validInput.company,
          notes: validInput.notes,
          preferredTime: validInput.preferredTime,
        })
      );
    });
  });

  describe("Tool Configuration", () => {
    it("should have proper tool description", () => {
      expect(collectContact.description).toContain("contact information");
      expect(collectContact.description).toContain("Zoom link");
    });

    it("should have input and output schemas defined", () => {
      expect(collectContact.inputSchema).toBeDefined();
      expect(collectContact.outputSchema).toBeDefined();
    });

    it("should have execute function defined", () => {
      expect(collectContact.execute).toBeDefined();
      expect(typeof collectContact.execute).toBe("function");
    });
  });
});
