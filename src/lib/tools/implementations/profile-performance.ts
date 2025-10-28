import { tool } from "ai";
import {
  profilePerformanceInputSchema,
  profilePerformanceOutputSchema,
  type ProfilePerformanceInput,
  type ProfilePerformanceOutput,
} from "@/lib/tools/zod-schemas";

const MOCK_PERF_METRICS: ProfilePerformanceOutput = {
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
  ],
  traceUrl: undefined,
};

export function profilePerformance(
  input: ProfilePerformanceInput
): ProfilePerformanceOutput {
  if (process.env.NODE_ENV !== "development") {
    throw new Error(
      "Performance profiling is only available in development mode"
    );
  }

  const includeScreenshots = input.includeScreenshots ?? false;

  return {
    ...MOCK_PERF_METRICS,
    traceUrl: includeScreenshots ? "/traces/performance-trace.json" : undefined,
  };
}

export const profilePerformanceTool = tool({
  name: "profile_performance",
  description:
    "Profile page performance metrics (development only) to surface LCP/FID/CLS/TTFB insights.",
  inputSchema: profilePerformanceInputSchema,
  outputSchema: profilePerformanceOutputSchema,
  execute: async (input) => profilePerformance(input),
});
