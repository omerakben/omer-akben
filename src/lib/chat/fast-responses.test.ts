import type { UIMessage } from "ai";
import { describe, expect, it } from "vitest";
import { FAST_INTRO_RESPONSE, shouldUseFastIntro } from "./fast-responses";

describe("Fast Intro Responses", () => {
  describe("shouldUseFastIntro", () => {
    describe("with no assistant messages (first user message)", () => {
      const emptyMessages: UIMessage[] = [];

      it("should return true for simple greeting 'hi'", () => {
        expect(shouldUseFastIntro("hi", emptyMessages)).toBe(true);
      });

      it("should return true for simple greeting 'hello'", () => {
        expect(shouldUseFastIntro("hello", emptyMessages)).toBe(true);
      });

      it("should return true for simple greeting 'hey'", () => {
        expect(shouldUseFastIntro("hey", emptyMessages)).toBe(true);
      });

      it("should return true for greeting with punctuation 'Hi!'", () => {
        expect(shouldUseFastIntro("Hi!", emptyMessages)).toBe(true);
      });

      it("should return true for greeting with capitalization 'HELLO'", () => {
        expect(shouldUseFastIntro("HELLO", emptyMessages)).toBe(true);
      });

      it("should return true for greeting with whitespace '  hey  '", () => {
        expect(shouldUseFastIntro("  hey  ", emptyMessages)).toBe(true);
      });

      it("should return true for 'tell me about yourself'", () => {
        expect(
          shouldUseFastIntro("tell me about yourself", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'tell me about you'", () => {
        expect(shouldUseFastIntro("tell me about you", emptyMessages)).toBe(
          true
        );
      });

      it("should return true for 'who are you'", () => {
        expect(shouldUseFastIntro("who are you", emptyMessages)).toBe(true);
      });

      it("should return true for 'who r u' (abbreviation)", () => {
        expect(shouldUseFastIntro("who r u", emptyMessages)).toBe(true);
      });

      it("should return true for 'who is omer'", () => {
        expect(shouldUseFastIntro("who is omer", emptyMessages)).toBe(true);
      });

      it("should return true for 'what do you do'", () => {
        expect(shouldUseFastIntro("what do you do", emptyMessages)).toBe(true);
      });

      it("should return true for 'tell me about your skills'", () => {
        expect(
          shouldUseFastIntro("tell me about your skills", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'what is your tech stack'", () => {
        expect(
          shouldUseFastIntro("what is your tech stack", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'what technology do you use'", () => {
        expect(
          shouldUseFastIntro("what technology do you use", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'what is your background'", () => {
        expect(
          shouldUseFastIntro("what is your background", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'tell me about your expertise'", () => {
        expect(
          shouldUseFastIntro("tell me about your expertise", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'what are your strengths'", () => {
        expect(
          shouldUseFastIntro("what are your strengths", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'what do you specialize in'", () => {
        expect(
          shouldUseFastIntro("what do you specialize in", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'give me an introduction'", () => {
        expect(
          shouldUseFastIntro("give me an introduction", emptyMessages)
        ).toBe(true);
      });

      it("should return true for 'summary of experience'", () => {
        expect(shouldUseFastIntro("summary of experience", emptyMessages)).toBe(
          true
        );
      });

      it("should return true for 'bio' (single word)", () => {
        expect(shouldUseFastIntro("bio", emptyMessages)).toBe(true);
      });

      it("should return true for 'profile' (single word)", () => {
        expect(shouldUseFastIntro("profile", emptyMessages)).toBe(true);
      });

      it("should return false for empty string", () => {
        expect(shouldUseFastIntro("", emptyMessages)).toBe(false);
      });

      it("should return false for whitespace only", () => {
        expect(shouldUseFastIntro("   ", emptyMessages)).toBe(false);
      });

      it("should return false for non-greeting/overview query", () => {
        expect(
          shouldUseFastIntro("what projects have you worked on", emptyMessages)
        ).toBe(false);
      });

      it("should return false for specific technical question", () => {
        expect(
          shouldUseFastIntro(
            "how do you implement rate limiting",
            emptyMessages
          )
        ).toBe(false);
      });

      it("should return false for contact-related query", () => {
        expect(shouldUseFastIntro("how can I contact you", emptyMessages)).toBe(
          false
        );
      });
    });

    describe("with existing assistant messages (not first message)", () => {
      const messagesWithAssistant: UIMessage[] = [
        { id: "1", role: "user", parts: [{ type: "text", text: "hi" }] },
        {
          id: "2",
          role: "assistant",
          parts: [{ type: "text", text: "Hello! How can I help?" }],
        },
      ];

      it("should return false for greeting when assistant has already responded", () => {
        expect(shouldUseFastIntro("hello", messagesWithAssistant)).toBe(false);
      });

      it("should return false for overview question when conversation has started", () => {
        expect(
          shouldUseFastIntro("tell me about yourself", messagesWithAssistant)
        ).toBe(false);
      });

      it("should return false for any query after assistant has responded", () => {
        expect(
          shouldUseFastIntro("what is your tech stack", messagesWithAssistant)
        ).toBe(false);
      });
    });

    describe("with only user messages (no assistant messages yet)", () => {
      const userOnlyMessages: UIMessage[] = [
        {
          id: "1",
          role: "user",
          parts: [{ type: "text", text: "some other message" }],
        },
      ];

      it("should return true for greeting even with previous user message", () => {
        expect(shouldUseFastIntro("hi", userOnlyMessages)).toBe(true);
      });

      it("should return true for overview question with previous user message", () => {
        expect(
          shouldUseFastIntro("tell me about yourself", userOnlyMessages)
        ).toBe(true);
      });
    });

    describe("edge cases and pattern matching", () => {
      const emptyMessages: UIMessage[] = [];

      it("should not match greeting as part of longer word (e.g., 'high')", () => {
        expect(shouldUseFastIntro("high quality code", emptyMessages)).toBe(
          false
        );
      });

      it("should not match 'hello' in 'shell commands'", () => {
        expect(shouldUseFastIntro("shell commands", emptyMessages)).toBe(false);
      });

      it("should match 'skill' anywhere in the query", () => {
        expect(
          shouldUseFastIntro("what skill do you have", emptyMessages)
        ).toBe(true);
      });

      it("should match 'tech' anywhere in the query", () => {
        expect(
          shouldUseFastIntro("show me your tech experience", emptyMessages)
        ).toBe(true);
      });

      it("should match 'stack' anywhere in the query", () => {
        expect(shouldUseFastIntro("full stack developer", emptyMessages)).toBe(
          true
        );
      });

      it("should handle mixed case patterns correctly", () => {
        expect(shouldUseFastIntro("Tell Me About YOU", emptyMessages)).toBe(
          true
        );
      });

      it("should handle trailing/leading whitespace and punctuation", () => {
        expect(
          shouldUseFastIntro("  tell me about yourself!!!  ", emptyMessages)
        ).toBe(true);
      });
    });
  });

  describe("FAST_INTRO_RESPONSE", () => {
    it("should be a non-empty string", () => {
      expect(FAST_INTRO_RESPONSE).toBeTruthy();
      expect(typeof FAST_INTRO_RESPONSE).toBe("string");
      expect(FAST_INTRO_RESPONSE.length).toBeGreaterThan(0);
    });

    it("should contain key information about AI engineering", () => {
      expect(FAST_INTRO_RESPONSE).toContain("AI");
      expect(FAST_INTRO_RESPONSE).toContain("full-stack");
    });

    it("should contain technical details", () => {
      expect(FAST_INTRO_RESPONSE).toMatch(/LangChain|OpenAI|Next\.js|React/);
    });

    it("should end with an engagement prompt", () => {
      expect(FAST_INTRO_RESPONSE).toMatch(/want|ready|dive/i);
    });
  });
});
