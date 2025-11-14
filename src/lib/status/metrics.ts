/**
 * Status Metrics Utility
 *
 * Provides runtime enrichment of status page metrics with live deployment information.
 * Replaces placeholder values with actual commit SHA, build date, and performance data.
 *
 * @module lib/status/metrics
 *
 * @example
 * ```tsx
 * import { enrichMetrics } from '@/lib/status/metrics';
 * import { statusData } from '@/data/status';
 *
 * // Enrich metrics at runtime
 * const liveMetrics = await enrichMetrics(statusData.metrics);
 * // Metrics now contain live values instead of placeholders
 * ```
 *
 * @remarks
 * - getDeployInfo() is safe to call at build time and runtime
 * - Environment variables are injected during build via Next.js config
 * - Fallback values ensure graceful degradation in local development
 */

import type { MetricBadge } from "@/data/status";
import { getProjectStatistics } from "@/lib/agent-knowledge/helpers/project-queries";

/**
 * Deployment information data structure
 */
export interface DeployInfo {
  /** Short commit SHA (7 characters) */
  sha: string;
  /** Build timestamp in ISO format or formatted string */
  buildDate: string;
}

const FALLBACK_SHA = "local";
const FALLBACK_BUILD_DATE = "dev";

/**
 * Formats commit SHA to short form (7 characters)
 *
 * @param value - Full commit SHA or null/undefined
 * @returns Short SHA (7 chars) or "local" fallback
 *
 * @example
 * ```ts
 * formatSha("abcdef1234567890") // "abcdef1"
 * formatSha(null) // "local"
 * ```
 */
const formatSha = (value?: string | null) => {
  if (!value) return FALLBACK_SHA;
  return value.slice(0, 7);
};

/**
 * Formats build date from environment variable or generates current timestamp
 *
 * @param value - Build date string from environment or null/undefined
 * @returns Formatted build date or current UTC timestamp
 *
 * @example
 * ```ts
 * formatBuildDate("2025-11-11 15:30 UTC") // "2025-11-11 15:30 UTC"
 * formatBuildDate(null) // "2025-11-11 15:30 UTC" (current time)
 * ```
 */
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
 *
 * Checks NEXT_PUBLIC_GIT_SHA and VERCEL_GIT_COMMIT_SHA environment variables
 * for commit information. Falls back to "local" and current timestamp in development.
 *
 * @returns DeployInfo object with sha and buildDate
 *
 * @example
 * ```ts
 * const { sha, buildDate } = getDeployInfo();
 * // Production: { sha: "abcdef1", buildDate: "2025-11-11 15:30 UTC" }
 * // Development: { sha: "local", buildDate: "2025-11-11 15:30 UTC" }
 * ```
 *
 * @remarks
 * - Safe to call at both build time and runtime
 * - Environment variables are injected via Next.js config during build
 * - VERCEL_GIT_COMMIT_SHA is auto-populated by Vercel deployments
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
 *
 * Future implementation will integrate with Lighthouse CI or similar performance
 * monitoring tools to provide real-time performance scores.
 *
 * @returns Performance snapshot string (currently "n/a")
 *
 * @example
 * ```ts
 * const perf = await getPerfSnapshot();
 * // Currently: "n/a"
 * // Future: "95/100" or "Good (1.2s FCP)"
 * ```
 *
 * @remarks
 * - Async to support future integration with external APIs
 * - Consider integrating with Vercel Speed Insights API
 * - Could also pull from Lighthouse CI dashboard
 */
export async function getPerfSnapshot(): Promise<string> {
  return "n/a";
}

/**
 * Injects live deploy/perf values into the provided metric badges.
 *
 * Replaces placeholder values in metric badges with live deployment information:
 * - "Commit" metric → Current commit SHA (short form)
 * - "Deploy" metric → Build timestamp
 * - "Perf Snapshot" metric → Performance score (placeholder for now)
 *
 * @param metrics - Array of metric badges to enrich
 * @returns Promise resolving to enriched metrics array
 *
 * @example
 * ```tsx
 * const metrics: MetricBadge[] = [
 *   { label: "Commit", value: "__GIT_SHA__", tooltip: "Current commit" },
 *   { label: "Deploy", value: "__BUILD_DATE__", tooltip: "Build time" }
 * ];
 *
 * const enriched = await enrichMetrics(metrics);
 * // [
 * //   { label: "Commit", value: "abcdef1", tooltip: "Current commit" },
 * //   { label: "Deploy", value: "2025-11-11 15:30 UTC", tooltip: "Build time" }
 * // ]
 * ```
 *
 * @remarks
 * - Non-matching metrics are returned unchanged
 * - Async to support future performance API integration
 * - Safe to call multiple times (idempotent)
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

/**
 * Project Portfolio Metrics
 *
 * Dynamic project statistics for status dashboard.
 * Automatically syncs with @/data/projects - no manual updates needed.
 *
 * @returns Comprehensive project portfolio metrics
 *
 * @example
 * ```tsx
 * const stats = getProjectMetrics();
 * // {
 * //   total: 12,
 * //   featured: 5,
 * //   liveProduction: 3,
 * //   ...
 * // }
 * ```
 *
 * @remarks
 * - Always current (pulls from projects.ts at runtime)
 * - Used for status page project statistics
 * - Includes image asset counts and technology coverage
 */
export function getProjectMetrics() {
  const stats = getProjectStatistics();

  return {
    // Core counts
    total: stats.total,
    featured: stats.featured,
    liveProduction: stats.liveProduction,
    publicGitHubRepos: stats.publicGitHubRepos,

    // Categories
    aiMlProjects: stats.aiMlProjects,
    categories: stats.categories,

    // Visual assets
    withScreenshots: stats.withScreenshots,
    screenshotCoverage: `${Math.round((stats.withScreenshots / stats.total) * 100)}%`,

    // Technology stack
    totalTechnologies: stats.technologies.length,
    topTechnologies: stats.technologies.slice(0, 10),

    // Recent updates
    recentUpdates: [
      `Added professional screenshots for ${stats.withScreenshots} projects`,
      `${stats.liveProduction} live production sites serving customers`,
      `Enhanced ${stats.aiMlProjects} AI/ML projects with latest tech stack`,
      'Implemented Elon University IP acknowledgments',
      'Updated to Next.js 15, React 19, Tailwind CSS 4',
    ],

    // Status summary
    statusSummary: {
      portfolioHealth: '100%',
      visualAssets: `${stats.withScreenshots}/${stats.total} projects`,
      productionSites: `${stats.liveProduction} live`,
      techStackCurrent: 'Next.js 15, React 19, Tailwind CSS 4',
    },
  };
}

/**
 * Generate project metrics badges for status dashboard
 *
 * Creates formatted metric badges showing portfolio statistics.
 *
 * @returns Array of project metric badges
 *
 * @example
 * ```tsx
 * const badges = getProjectMetricBadges();
 * // [
 * //   { label: "Projects", value: "12", tooltip: "Total portfolio projects" },
 * //   { label: "Featured", value: "5", tooltip: "Homepage featured projects" },
 * //   ...
 * // ]
 * ```
 */
export function getProjectMetricBadges(): MetricBadge[] {
  const metrics = getProjectMetrics();

  return [
    {
      label: 'Projects',
      value: metrics.total.toString(),
      tooltip: 'Total portfolio projects',
    },
    {
      label: 'Featured',
      value: metrics.featured.toString(),
      tooltip: 'Homepage featured projects',
    },
    {
      label: 'Live Sites',
      value: metrics.liveProduction.toString(),
      tooltip: 'Production sites serving customers',
    },
    {
      label: 'Screenshots',
      value: metrics.screenshotCoverage,
      tooltip: `${metrics.withScreenshots}/${metrics.total} projects with professional screenshots`,
    },
    {
      label: 'Public Repos',
      value: metrics.publicGitHubRepos.toString(),
      tooltip: 'Open-source GitHub repositories',
    },
    {
      label: 'AI/ML Projects',
      value: metrics.aiMlProjects.toString(),
      tooltip: 'Production AI/ML implementations',
    },
    {
      label: 'Technologies',
      value: `${metrics.totalTechnologies}+`,
      tooltip: 'Unique technologies across all projects',
    },
  ];
}
