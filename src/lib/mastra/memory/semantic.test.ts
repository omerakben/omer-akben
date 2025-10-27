import { beforeEach, describe, expect, it, vi } from "vitest";

const callMock = vi.fn();

vi.mock("@/lib/redis/client", () => ({
  getRedisClient: () => ({
    call: callMock,
  }),
}));

describe("RedisSemanticMemory", () => {
  beforeEach(() => {
    callMock.mockReset();
  });

  it("returns null when no payload stored", async () => {
    callMock.mockResolvedValueOnce(null);
    const { RedisSemanticMemory } = await import("./semantic");
    const memory = new RedisSemanticMemory();
    const result = await memory.getFacts("user");
    expect(result).toBeNull();
  });

  it("parses stored JSON", async () => {
    callMock.mockResolvedValueOnce(['{"facts":{"role":"admin"}}']);
    const { RedisSemanticMemory } = await import("./semantic");
    const memory = new RedisSemanticMemory();
    const result = await memory.getFacts("user");
    expect(result).toEqual({ facts: { role: "admin" } });
  });

  it("merges new facts with existing", async () => {
    callMock
      .mockResolvedValueOnce(['{"facts":{"role":"admin"}}'])
      .mockResolvedValueOnce(undefined);

    const { RedisSemanticMemory } = await import("./semantic");
    const memory = new RedisSemanticMemory();
    await memory.mergeFacts("user", { level: 7 });

    const [, , , payload] = callMock.mock.calls.at(-1) ?? [];
    expect(typeof payload).toBe("string");
    expect(payload && JSON.parse(payload)).toEqual({
      facts: { role: "admin", level: 7 },
    });
  });
});
