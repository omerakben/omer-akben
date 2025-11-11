import type { MetricBadge } from "@/data/status";

export interface DeployInfo {
  sha: string;
  buildDate: string;
}

const FALLBACK_SHA = "local";
const FALLBACK_BUILD_DATE = "dev";

const formatSha = (value?: string | null) => {
  if (!value) return FALLBACK_SHA;
  return value.slice(0, 7);
};

const formatBuildDate = (value?: string | null) => {
  if (value && value.trim().length > 0) {
    return value;
  }

  const now = new Date();
  const iso = now.toISOString().slice(0, 16).replace("T", " ");
  return `${iso} UTC`;
};

/**
 * Returns commit SHA and build date injected at build time.
 */
export function getDeployInfo(): DeployInfo {
  const sha = formatSha(
    process.env.NEXT_PUBLIC_GIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA
  );
  const buildDate = formatBuildDate(process.env.NEXT_PUBLIC_BUILD_DATE);

  return {
    sha,
    buildDate: buildDate || FALLBACK_BUILD_DATE,
  };
}

/**
 * Placeholder for linking real performance telemetry.
 */
export async function getPerfSnapshot(): Promise<string> {
  return "n/a";
}

/**
 * Injects live deploy/perf values into the provided metric badges.
 */
export async function enrichMetrics(
  metrics: MetricBadge[]
): Promise<MetricBadge[]> {
  const info = getDeployInfo();
  const perfSnapshot = await getPerfSnapshot();

  return metrics.map((metric) => {
    if (metric.label === "Commit") {
      return { ...metric, value: info.sha };
    }

    if (metric.label === "Deploy") {
      return { ...metric, value: info.buildDate };
    }

    if (metric.label === "Perf Snapshot") {
      return { ...metric, value: perfSnapshot };
    }

    return metric;
  });
}
