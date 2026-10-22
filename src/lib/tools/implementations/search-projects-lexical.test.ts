import { describe, expect, it } from "vitest";
import { searchProjectsLexical } from "@/lib/tools/implementations/search-projects-lexical";

describe("searchProjectsLexical", () => {
  it("finds TUEL projects from the local corpus", () => {
    const hits = searchProjectsLexical("Tuel", 5);
    const slugs = hits.map((hit) => hit.slug);

    expect(hits.length).toBeGreaterThan(0);
    expect(slugs.some((slug) => slug.includes("tuel") || slug === "elon-ai")).toBe(
      true
    );
  });
});
