export const BUILD_ID =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_BUILD_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  "dev";

export const BUILD_DATE =
  process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString();
