import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get: (_, prop: string) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Component = ({ children, ...props }: any) => {
            // Return a simple div for motion components
            return React.createElement("div", props, children);
          };
          Component.displayName = `motion.${prop}`;
          return Component;
        },
      }
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AnimatePresence: ({ children }: any) => children,
    useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSpring: (value: any) => value,
    useInView: () => true,
  };
});
