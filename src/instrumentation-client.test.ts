import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const initMock = vi.fn();
const replayIntegrationMock = vi.fn(() => ({ name: "replay" }));
const captureRouterTransitionStartMock = vi.fn();

vi.mock("@sentry/nextjs", () => ({
  init: initMock,
  replayIntegration: replayIntegrationMock,
  captureRouterTransitionStart: captureRouterTransitionStartMock,
}));

const originalNodeEnv = process.env.NODE_ENV;

describe("instrumentation-client", () => {
  beforeEach(() => {
    vi.resetModules();
    initMock.mockClear();
    replayIntegrationMock.mockClear();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("disables Sentry outside production", async () => {
    process.env.NODE_ENV = "development";

    await import("@/instrumentation-client");

    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock.mock.calls[0]?.[0]).toMatchObject({ enabled: false });
  });

  it("enables Sentry in production", async () => {
    process.env.NODE_ENV = "production";

    await import("@/instrumentation-client");

    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock.mock.calls[0]?.[0]).toMatchObject({ enabled: true });
  });
});
