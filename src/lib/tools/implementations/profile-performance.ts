import { tool } from "ai";

import {
  ProfilePerformanceInput,
  ProfilePerformanceResponse,
  createErrorResponse,
  createSuccessResponse,
  profilePerformanceInputSchema,
  profilePerformanceResponseSchema,
} from "@/lib/tools/zod-schemas";

const MOCK_METRICS = {
  metrics: {
    lcp: 1250,
    fid: 85,
    cls: 0.08,
    ttfb: 450,
  },
  suggestions: [
    "Consider lazy loading images to improve LCP",
    "Optimize JavaScript bundle size for better FID",
    "Use CSS containment to reduce CLS",
    "Enable HTTP/2 server push for faster TTFB",
  ] as string[],
};

export const profilePerformance = tool<
  ProfilePerformanceInput,
  ProfilePerformanceResponse
>({
  description: "Profile page performance metrics (development-only).",
  inputSchema: profilePerformanceInputSchema,
  outputSchema: profilePerformanceResponseSchema,
  execute: async (input) => {
    if (process.env.NODE_ENV !== "development") {
      return createErrorResponse(
        "Performance profiling is only available in development mode"
      );
    }

    return createSuccessResponse({
      ...MOCK_METRICS,
      traceUrl: input.includeScreenshots
        ? "/traces/performance-trace.json"
        : undefined,
    });
  },
});
