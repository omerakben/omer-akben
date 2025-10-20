import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import type { Mock } from "vitest";
import {
  __resetRedisClientForTesting,
  getRedisClient,
  type FtSearchResult,
} from "./client";

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = global.fetch;

function mockFetchSequence(results: Array<{ result?: unknown; error?: string }>) {
  const fetchMock = vi.fn();
  results.forEach((payload) => {
    fetchMock.mockResolvedValueOnce({
      ok: !payload.error,
      json: async () => payload,
      status: payload.error ? 500 : 200,
    } as unknown as Response);
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock as unknown as Mock;
}

describe("redis client", () => {
  beforeEach(() => {
    __resetRedisClientForTesting();
    process.env.UPSTASH_REDIS_REST_URL = "https://example.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
  });

  afterEach(() => {
    __resetRedisClientForTesting();
    process.env = { ...ORIGINAL_ENV };
    global.fetch = ORIGINAL_FETCH;
  });

  it("throws when env is missing", () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    expect(() => getRedisClient()).toThrowError(/UPSTASH_REDIS_REST_URL/);
  });

  it("executes raw commands via fetch", async () => {
    const fetchMock = mockFetchSequence([{ result: "OK" }]);

    const client = getRedisClient();
    await client.call("SET", "foo", "bar");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      })
    );
    const payload = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(payload).toEqual(["SET", "foo", "bar"]);
  });

  it("supports FT commands and parses search responses", async () => {
    const fetchMock = mockFetchSequence([
      { result: "OK" },
      { result: [1, "doc-1", ["field", "value", "vector_score", "0.42"]] },
    ]);

    const client = getRedisClient();
    await client.ft.create("idx", {
      "$.field": { type: "TAG", AS: "field" },
    });

    const searchResult = (await client.ft.search("idx", "*")) as FtSearchResult;
    expect(searchResult.total).toBe(1);
    expect(searchResult.documents[0]).toEqual({
      id: "doc-1",
      value: {
        field: "value",
        vector_score: "0.42",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const searchPayload = JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string);
    expect(searchPayload.slice(0, 3)).toEqual(["FT.SEARCH", "idx", "*"]);
  });
});
