import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

const ensureLocalStorage = () => {
  const hasStorage =
    typeof globalThis.localStorage !== "undefined" &&
    typeof globalThis.localStorage.clear === "function";

  if (hasStorage) {
    return;
  }

  let store: Record<string, string> = {};

  const localStorageMock = {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
    },
    key(index: number) {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    configurable: true,
  });

  if (typeof window !== "undefined") {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });
  }
};

ensureLocalStorage();

process.on("warning", (warning) => {
  if (warning.message.includes("--localstorage-file")) {
    return;
  }
  console.warn(warning);
});

const noisyConsolePatterns: RegExp[] = [
  /Not implemented: HTMLCanvasElement's getContext\(\) method/i,
  /Not implemented: navigation to another Document/i,
  /^\[ModelFallback\]/,
  /^\[tools\/download-resume:POST\]/,
  /^\[cache-metrics:GET\]/,
  /^\[FollowupCache\]/,
  /^\[ThreadMemory\]/,
  /^\[cache-preferences:POST\]/,
  /^\[cache-preferences:POST:redis\]/,
  /^\[cache-preferences:GET(:redis)?\]/,
  /^\[search-projects-semantic:POST\]/,
  /^\[ResumeDownload\]/,
  /^\[FactExtractor\]/,
  /^\[Cache:embedding\]/,
  /^\[Cache:completion\]/,
  /^\[SemanticMemory\]/,
  /^\[n8n\]/,
  /error-boundary\.test\.tsx/,
  /Test error message/,
];

const originalConsoleError = console.error.bind(console);
const originalConsoleWarn = console.warn.bind(console);

console.error = (...args: unknown[]) => {
  const message = args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }
      if (arg instanceof Error) {
        return arg.message;
      }
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(" ");

  if (noisyConsolePatterns.some((pattern) => pattern.test(message))) {
    return;
  }

  originalConsoleError(...args);
};

console.warn = (...args: unknown[]) => {
  const message = args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }
      if (arg instanceof Error) {
        return arg.message;
      }
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(" ");

  if (noisyConsolePatterns.some((pattern) => pattern.test(message))) {
    return;
  }

  originalConsoleWarn(...args);
};

const originalStderrWrite = process.stderr.write.bind(process.stderr);

process.stderr.write = (
  chunk: string | Uint8Array,
  encoding?: BufferEncoding | ((error?: Error | null) => void),
  callback?: (error?: Error | null) => void
) => {
  const text =
    typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");

  if (noisyConsolePatterns.some((pattern) => pattern.test(text))) {
    if (typeof encoding === "function") {
      encoding();
    } else if (callback) {
      callback();
    }
    return true;
  }

  return originalStderrWrite(chunk, encoding as BufferEncoding, callback);
};

const resetCanvasGetContext = () => {
  if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  }
};

resetCanvasGetContext();

afterEach(() => {
  resetCanvasGetContext();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    React.createElement("a", props, children),
}));

vi.mock("@/lib/analytics/posthog-client", () => ({
  posthog: {
    capture: vi.fn(),
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get: (_, prop: string) => {
          const Component = ({
            children,
            ...props
          }: React.PropsWithChildren<Record<string, unknown>>) => {
            // Return a simple div for motion components
            return React.createElement("div", props, children);
          };
          Component.displayName = `motion.${prop}`;
          return Component;
        },
      },
    ),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
    useSpring: (value: unknown) => value,
    useInView: () => true,
  };
});
