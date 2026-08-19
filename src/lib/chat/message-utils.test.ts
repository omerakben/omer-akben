import { describe, expect, it } from "vitest";
import {
  extractNavigationLinks,
  getMessageText,
  hasVisibleAssistantContent,
  isToolNarrationText,
} from "@/lib/chat/message-utils";
import type { UIMessage } from "ai";

const BIO =
  "I'm a founder and AI full-stack engineer with 6+ years spanning QA/SDET and product delivery.";

const NAV_OUTPUT = {
  success: true,
  data: {
    links: [
      { label: "Projects Page", href: "/projects", type: "internal" as const },
      { label: "Skills Page", href: "/skills", type: "internal" as const },
      {
        label: "Career Journey Page",
        href: "/journey",
        type: "internal" as const,
      },
    ],
  },
};

describe("getMessageText", () => {
  it("returns empty string when parts are missing instead of throwing", () => {
    const message = {
      id: "legacy",
      role: "user",
    } as UIMessage;

    expect(getMessageText(message)).toBe("");
  });

  it("reads a single text part", () => {
    const message: UIMessage = {
      id: "1",
      role: "user",
      parts: [{ type: "text", text: "Tell me about yourself." }],
    };

    expect(getMessageText(message)).toBe("Tell me about yourself.");
  });

  it("keeps streamed bio when a later nav tool and narration arrive", () => {
    const message = {
      id: "intro-rewrite",
      role: "assistant",
      parts: [
        { type: "text", text: BIO },
        {
          type: "tool-provide_navigation_links",
          toolCallId: "nav-1",
          state: "output-available",
          output: NAV_OUTPUT,
        },
        {
          type: "text",
          text: "[Navigation buttons for Projects, Skills, and Career Journey pages now appear above.]",
        },
      ],
    } as UIMessage;

    const text = getMessageText(message);
    expect(text).toContain(BIO);
    expect(text).not.toMatch(/\[Navigation buttons/);
    expect(extractNavigationLinks(message)).toHaveLength(3);
    expect(hasVisibleAssistantContent(message)).toBe(true);
  });

  it("keeps bio plus a later non-narration CTA in one assistant turn", () => {
    const cta = "What would you like to explore - projects, skills, or my career journey?";
    const message = {
      id: "intro-cta",
      role: "assistant",
      parts: [
        { type: "text", text: BIO },
        {
          type: "dynamic-tool",
          toolName: "provide_navigation_links",
          toolCallId: "nav-2",
          state: "output-available",
          input: {},
          output: NAV_OUTPUT,
        },
        { type: "text", text: cta },
      ],
    } as UIMessage;

    const text = getMessageText(message);
    expect(text).toContain(BIO);
    expect(text).toContain(cta);
    expect(extractNavigationLinks(message).map((link) => link.href)).toEqual([
      "/projects",
      "/skills",
      "/journey",
    ]);
  });

  it("strips clickable-button narration so it cannot replace the bio", () => {
    const message = {
      id: "repeat-intro",
      role: "assistant",
      parts: [
        { type: "text", text: BIO },
        {
          type: "text",
          text: "I've provided clickable navigation buttons to help you explore Omer's work. What interests you most?",
        },
      ],
    } as UIMessage;

    const text = getMessageText(message);
    expect(text).toContain(BIO);
    expect(text).not.toMatch(/I've provided clickable navigation buttons/i);
  });

  it("returns empty string for a tool-only assistant message", () => {
    const message = {
      id: "tool-only",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolName: "open_project",
          toolCallId: "call-1",
          state: "output-available",
          input: { slug: "elon-ai" },
          output: { success: true },
        },
      ],
    } as UIMessage;

    expect(getMessageText(message)).toBe("");
    expect(hasVisibleAssistantContent(message)).toBe(false);
  });
});

describe("isToolNarrationText", () => {
  it("flags bracketed navigation narration", () => {
    expect(
      isToolNarrationText(
        "[Navigation buttons for Projects, Skills, and Career Journey pages now appear above.]"
      )
    ).toBe(true);
  });
});
