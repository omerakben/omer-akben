import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /**
     * Navigation timeout: 90s to handle Turbopack on-demand compilation
     * 
     * WHY 90s? Turbopack's first compilation of a route can take 60-90s due to:
     * - On-demand compilation (routes aren't pre-compiled)
     * - Module graph traversal for dependencies
     * - TypeScript type checking per route
     * - React Server Component serialization
     * 
     * TESTED: 60s causes 2/127 test failures (recruiter, skills routes)
     * ALTERNATIVE: Could reduce to 45s in CI with --production build, but that
     * defeats the purpose of testing dev server behavior (the real user experience)
     */
    navigationTimeout: 90000,
  },
  /**
   * Test timeout: 90s per test
   * 
   * JUSTIFICATION: Each test may visit new routes that trigger Turbopack compilation.
   * With 8 routes tested in a11y.spec.ts, some tests will hit uncompiled routes.
   * 
   * OPTIMIZATION NOTES:
   * - Production build (npm run build && npm start): ~3s per route, could use 30s timeout
   * - Dev server caching: After first run, subsequent tests use ~10s per route
   * - This timeout is for WORST CASE: first run with cold Turbopack cache
   */
  timeout: 90000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000, // Reduced from 120s based on typical startup time
  },
});
