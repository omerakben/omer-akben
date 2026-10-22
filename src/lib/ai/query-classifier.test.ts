import { describe, expect, it } from "vitest";
import { classifyQuery } from "@/lib/ai/query-classifier";

describe("classifyQuery", () => {
  it("keeps short factual TUEL lookups on the fast path", () => {
    expect(classifyQuery("Tuel")).toBe("simple");
    expect(classifyQuery("What is Tuel?")).toBe("simple");
    expect(classifyQuery("What is TUEL AI?")).toBe("simple");
  });

  it("routes longer explanation phrasing to the reasoning model", () => {
    expect(classifyQuery("Can you explain TUEL AI project?")).toBe("complex");
  });

  it("treats intro and presence checks as simple", () => {
    expect(classifyQuery("Tell me about yourself.")).toBe("simple");
    expect(classifyQuery("Are u there?")).toBe("simple");
  });
});
