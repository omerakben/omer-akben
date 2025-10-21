import { profilePerformanceInputSchema } from "@/lib/agent-tools/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Only available in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        success: false,
        error: "Performance profiling is only available in development mode",
      },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const includeScreenshots =
      searchParams.get("includeScreenshots") === "true";
    const duration = Number(searchParams.get("duration")) || 5000;

    const input = profilePerformanceInputSchema.parse({
      includeScreenshots,
      duration,
    });

    const mockMetrics = {
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
      traceUrl: input.includeScreenshots
        ? "/traces/performance-trace.json"
        : undefined,
    };

    return NextResponse.json({
      success: true,
      data: mockMetrics,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Only available in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        success: false,
        error: "Performance profiling is only available in development mode",
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { includeScreenshots } = profilePerformanceInputSchema.parse(body);
    // Note: duration parameter validated but not yet used in MVP implementation

    // For MVP, return mock performance metrics
    // Future: Integrate Chrome DevTools MCP for real profiling
    const mockMetrics = {
      metrics: {
        lcp: 1250, // Largest Contentful Paint (good < 2500ms)
        fid: 85, // First Input Delay (good < 100ms)
        cls: 0.08, // Cumulative Layout Shift (good < 0.1)
        ttfb: 450, // Time to First Byte (good < 600ms)
      },
      suggestions: [
        "Consider lazy loading images to improve LCP",
        "Optimize JavaScript bundle size for better FID",
        "Use CSS containment to reduce CLS",
        "Enable HTTP/2 server push for faster TTFB",
      ],
      traceUrl: includeScreenshots
        ? "/traces/performance-trace.json"
        : undefined,
    };

    return NextResponse.json({
      success: true,
      data: mockMetrics,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}
