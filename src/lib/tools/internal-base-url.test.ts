import { afterEach, describe, expect, it } from "vitest";
import { resolveInternalToolBaseUrl } from "@/lib/tools/internal-base-url";

describe("resolveInternalToolBaseUrl", () => {
  const original = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  afterEach(() => {
    process.env.NODE_ENV = original.NODE_ENV;
    process.env.VERCEL = original.VERCEL;
    process.env.VERCEL_URL = original.VERCEL_URL;
    process.env.NEXT_PUBLIC_BASE_URL = original.NEXT_PUBLIC_BASE_URL;
  });

  it("never returns localhost in production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.VERCEL;
    delete process.env.VERCEL_URL;
    delete process.env.NEXT_PUBLIC_BASE_URL;

    expect(resolveInternalToolBaseUrl()).toBeNull();
  });

  it("rejects an explicit localhost origin in production", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_BASE_URL = "http://127.0.0.1:3001";

    expect(resolveInternalToolBaseUrl()).toBeNull();
  });

  it("uses VERCEL_URL when no public origin is set", () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_BASE_URL;
    process.env.VERCEL_URL = "omer-akben.vercel.app";

    expect(resolveInternalToolBaseUrl()).toBe(
      "https://omer-akben.vercel.app"
    );
  });
});
