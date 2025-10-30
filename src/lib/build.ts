const resolveBuildId = () => {
  const envBuildId =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.NEXT_PUBLIC_BUILD_ID;

  if (envBuildId && envBuildId.trim().length > 0) {
    return envBuildId;
  }

  if (typeof globalThis !== "undefined") {
    const existing = (globalThis as Record<string, unknown>).__OZZY_BUILD_ID__;
    if (typeof existing === "string" && existing.length > 0) {
      return existing;
    }
    const fallback = "dev";
    (globalThis as Record<string, unknown>).__OZZY_BUILD_ID__ = fallback;
    return fallback;
  }

  return "dev";
};

const resolveBuildDate = () => {
  const envBuildDate = process.env.NEXT_PUBLIC_BUILD_DATE;
  if (envBuildDate && envBuildDate.trim().length > 0) {
    return envBuildDate;
  }

  if (typeof globalThis !== "undefined") {
    const existing = (globalThis as Record<string, unknown>).__OZZY_BUILD_DATE__;
    if (typeof existing === "string" && existing.length > 0) {
      return existing;
    }
    const computed = new Date().toISOString();
    (globalThis as Record<string, unknown>).__OZZY_BUILD_DATE__ = computed;
    return computed;
  }

  return new Date().toISOString();
};

export const BUILD_ID = resolveBuildId();
export const BUILD_DATE = resolveBuildDate();

export const SHORT_BUILD_ID = BUILD_ID.slice(0, 7);
