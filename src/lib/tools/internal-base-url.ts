/**
 * Resolve a public origin for rare HTTP tool hops.
 * Production must never fall back to 127.0.0.1 / localhost — that is the
 * live Ozzy failure (search_projects_semantic → ECONNREFUSED :3001).
 */

const LOCAL_DEV_ORIGIN = "http://localhost:3001";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostOrigin(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return /localhost|127\.0\.0\.1/.test(url);
  }
}

export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
  );
}

export function resolveInternalToolBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) {
    const origin = stripTrailingSlash(configured);
    if (isProductionRuntime() && isLocalhostOrigin(origin)) {
      return null;
    }
    return origin;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  if (isProductionRuntime()) {
    return null;
  }

  return LOCAL_DEV_ORIGIN;
}
