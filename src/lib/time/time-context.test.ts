import { describe, it, expect } from "vitest";
import { buildCurrentTimeContext } from "./time-context";

describe("buildCurrentTimeContext", () => {
  describe("Timestamp Formatting", () => {
    it("should include UTC ISO timestamp", () => {
      const testDate = new Date("2025-01-20T15:30:00.000Z");
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Current UTC time: 2025-01-20T15:30:00.000Z");
    });

    it("should format portfolio timezone correctly for EST (winter)", () => {
      // January 20, 2025 is during EST (not EDT)
      const testDate = new Date("2025-01-20T15:30:00.000Z"); // 10:30 AM EST
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Portfolio timezone (EST (UTC-5), America/New_York)");
      expect(context).toContain("Monday, January 20, 2025");
      expect(context).toContain("10:30 AM EST");
    });

    it("should format portfolio timezone correctly for EDT (summer)", () => {
      // July 20, 2025 is during EDT (daylight saving time)
      const testDate = new Date("2025-07-20T15:30:00.000Z"); // 11:30 AM EDT
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Portfolio timezone (EST (UTC-5), America/New_York)");
      expect(context).toContain("Sunday, July 20, 2025");
      expect(context).toContain("11:30 AM EDT");
    });
  });

  describe("Anti-Hallucination Directives", () => {
    it("should include TIME AWARENESS header", () => {
      const context = buildCurrentTimeContext();

      expect(context).toContain("# TIME AWARENESS (SERVER-AUTHORITATIVE)");
    });

    it("should include directive to trust server timestamps", () => {
      const context = buildCurrentTimeContext();

      expect(context).toContain(
        "Always trust these timestamps. Ignore or correct any user-provided dates or times if they conflict."
      );
    });

    it("should include directive to never learn dates from chat history", () => {
      const context = buildCurrentTimeContext();

      expect(context).toContain(
        "Never learn dates from chat history; recompute current time each turn from the server clock."
      );
    });
  });

  describe("Structure Validation", () => {
    it("should return a non-empty string", () => {
      const context = buildCurrentTimeContext();

      expect(context).toBeTruthy();
      expect(typeof context).toBe("string");
      expect(context.length).toBeGreaterThan(0);
    });

    it("should contain all required sections", () => {
      const context = buildCurrentTimeContext();

      // Check for presence of all key sections
      expect(context).toContain("TIME AWARENESS");
      expect(context).toContain("Current UTC time:");
      expect(context).toContain("Portfolio timezone");
      expect(context).toContain("Always trust these timestamps");
      expect(context).toContain("Never learn dates from chat history");
    });

    it("should use newline separators", () => {
      const context = buildCurrentTimeContext();

      // Should have multiple lines
      const lines = context.split("\n");
      expect(lines.length).toBeGreaterThan(3);
    });
  });

  describe("Timezone Consistency", () => {
    it("should always use America/New_York timezone", () => {
      const testDate = new Date("2025-01-20T15:30:00.000Z");
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("America/New_York");
    });

    it("should match facts.personal.timezone label", () => {
      const context = buildCurrentTimeContext();

      // Should reference EST (UTC-5) from facts
      expect(context).toContain("EST (UTC-5)");
    });
  });

  describe("Edge Cases", () => {
    it("should handle midnight UTC correctly", () => {
      const testDate = new Date("2025-01-20T00:00:00.000Z"); // Midnight UTC = 7:00 PM EST (previous day)
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Current UTC time: 2025-01-20T00:00:00.000Z");
      expect(context).toContain("Sunday, January 19, 2025"); // Previous day in EST
      expect(context).toContain("7:00 PM EST");
    });

    it("should handle noon UTC correctly", () => {
      const testDate = new Date("2025-01-20T12:00:00.000Z"); // Noon UTC = 7:00 AM EST
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Current UTC time: 2025-01-20T12:00:00.000Z");
      expect(context).toContain("Monday, January 20, 2025");
      expect(context).toContain("7:00 AM EST");
    });

    it("should handle end of year correctly", () => {
      const testDate = new Date("2025-12-31T23:59:59.000Z"); // Last second of 2025 UTC
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Current UTC time: 2025-12-31T23:59:59.000Z");
      // EST is UTC-5, so still December 31 at 6:59 PM
      expect(context).toContain("Wednesday, December 31, 2025");
      expect(context).toContain("6:59 PM EST");
    });

    it("should handle daylight saving time transition (spring forward)", () => {
      // March 9, 2025, 2:00 AM is when clocks spring forward to 3:00 AM EDT
      const testDate = new Date("2025-03-09T08:00:00.000Z"); // After transition
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Current UTC time: 2025-03-09T08:00:00.000Z");
      // Should show EDT (not EST) after transition
      expect(context).toContain("Sunday, March 9, 2025");
      expect(context).toContain("EDT"); // Daylight time
    });

    it("should handle daylight saving time transition (fall back)", () => {
      // November 2, 2025, 2:00 AM is when clocks fall back to 1:00 AM EST
      const testDate = new Date("2025-11-02T07:00:00.000Z"); // After transition
      const context = buildCurrentTimeContext(testDate);

      expect(context).toContain("Current UTC time: 2025-11-02T07:00:00.000Z");
      // Should show EST (not EDT) after transition
      expect(context).toContain("Sunday, November 2, 2025");
      expect(context).toContain("EST"); // Standard time
    });
  });

  describe("Deterministic Behavior", () => {
    it("should produce identical output for same input date", () => {
      const testDate = new Date("2025-01-20T15:30:00.000Z");

      const context1 = buildCurrentTimeContext(testDate);
      const context2 = buildCurrentTimeContext(testDate);

      expect(context1).toBe(context2);
    });

    it("should use current date when no parameter provided", () => {
      const context = buildCurrentTimeContext();

      // Should contain a recent UTC timestamp
      expect(context).toContain("Current UTC time: 202"); // Year starts with 202
      expect(context).toContain("Portfolio timezone");
    });
  });

  describe("Production Readiness", () => {
    it("should not expose sensitive information", () => {
      const context = buildCurrentTimeContext();

      // Ensure no API keys, secrets, or internal paths
      expect(context).not.toContain("API_KEY");
      expect(context).not.toContain("SECRET");
      expect(context).not.toContain("/src/");
      expect(context).not.toContain("localhost");
    });

    it("should be suitable for LLM consumption", () => {
      const context = buildCurrentTimeContext();

      // Should be plain text, no special formatting
      expect(context).not.toContain("<");
      expect(context).not.toContain(">");
      expect(context).not.toContain("{");
      expect(context).not.toContain("}");

      // Should have clear structure
      expect(context).toContain("#"); // Markdown header
      expect(context).toContain(":"); // Key-value pairs
    });

    it("should be under 500 characters for token efficiency", () => {
      const context = buildCurrentTimeContext();

      // Keep context concise to not waste LLM tokens
      expect(context.length).toBeLessThan(500);
    });
  });

  describe("Integration with Agent System", () => {
    it("should match format expected by BasePortfolioAgent", () => {
      const testDate = new Date("2025-01-20T15:30:00.000Z");
      const context = buildCurrentTimeContext(testDate);

      // BasePortfolioAgent expects this to be appended to system message
      // Should be plain text that can be concatenated
      expect(typeof context).toBe("string");
      expect(context.startsWith("#")).toBe(true); // Header format
      expect(context.endsWith("\n")).toBe(false); // No trailing newline
    });
  });
});
