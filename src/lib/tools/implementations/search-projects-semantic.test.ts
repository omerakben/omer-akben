import { beforeEach, describe, expect, it, vi } from "vitest";

const searchProjectsBySimilarity = vi.fn();

vi.mock("@/lib/redis/embeddings", () => ({
  searchProjectsBySimilarity: (...args: unknown[]) =>
    searchProjectsBySimilarity(...args),
}));

describe("searchProjectsSemantic", () => {
  beforeEach(() => {
    searchProjectsBySimilarity.mockReset();
  });

  it("fail-opens to the local corpus when vector search throws", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    searchProjectsBySimilarity.mockRejectedValueOnce(
      new Error("ECONNREFUSED 127.0.0.1:3001")
    );

    const { searchProjectsSemantic } = await import(
      "./search-projects-semantic"
    );

    const result = await searchProjectsSemantic.execute!(
      { query: "What is Tuel?", limit: 5 },
      {} as never
    );

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.count).toBeGreaterThan(0);
      expect(
        result.data.results.some(
          (hit) =>
            hit.slug.includes("tuel") ||
            hit.slug === "elon-ai" ||
            `${hit.project.title ?? ""}`.toLowerCase().includes("tuel")
        )
      ).toBe(true);
    }

    fetchSpy.mockRestore();
  });
});
