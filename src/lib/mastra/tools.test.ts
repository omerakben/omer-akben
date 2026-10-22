import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const searchProjectsBySimilarity = vi.fn();

vi.mock("@/lib/redis/embeddings", () => ({
  searchProjectsBySimilarity: (...args: unknown[]) =>
    searchProjectsBySimilarity(...args),
}));

describe("mastra searchProjectsSemanticTool", () => {
  beforeEach(() => {
    searchProjectsBySimilarity.mockReset();
  });

  it("does not hardcode a localhost production fallback", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/mastra/tools.ts"),
      "utf8"
    );

    expect(source).not.toContain("localhost:3001");
    expect(source).not.toContain("127.0.0.1");
    expect(source).not.toContain("NEXT_PUBLIC_BASE_URL");
  });

  it("runs search in-process and never fetches localhost", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_BASE_URL;
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    searchProjectsBySimilarity.mockRejectedValueOnce(
      new Error("fetch failed")
    );

    const { searchProjectsSemanticTool } = await import("./tools");
    const result = await searchProjectsSemanticTool.execute!(
      { query: "What is Tuel?" },
      {} as never
    );

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result).toMatchObject({ success: true });

    fetchSpy.mockRestore();
  });
});
