import { describe, expect, it, vi } from "vitest";
import { executeFollowupAction } from "@/lib/followups/action-mapper";

describe("follow-up navigation", () => {
  it.each([
    ["open_project", { slug: "elon-ai" }, "/projects/elon-ai"],
    ["list_projects", { category: "AI & ML" }, "/projects?category=AI%20%26%20ML"],
    ["search_projects", { query: "AI tools" }, "/projects?search=AI%20tools"],
  ] as const)("routes %s through the supplied app router", async (action, args, url) => {
    const router = { push: vi.fn() };
    expect(await executeFollowupAction(action, args, router)).toBe(true);
    expect(router.push).toHaveBeenCalledExactlyOnceWith(url);
  });

  it.each(["open_project", "list_projects", "search_projects"] as const)(
    "does not claim %s navigated when no router was supplied",
    async (action) => {
      expect(await executeFollowupAction(action, { slug: "elon-ai", query: "AI" })).toBe(false);
    },
  );
});
