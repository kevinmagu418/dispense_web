import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end configuration.
 *
 * Six projects so the same specs run on every engine the site must support:
 *   chrome / edge  — the locally installed browsers (Chrome and Edge on Windows)
 *   firefox        — Gecko, downloaded by Playwright
 *   webkit         — WebKit (closest available proxy for Safari on this machine)
 *   iphone         — WebKit with an iPhone viewport and touch input
 *   android        — Chrome with a Pixel viewport and touch input
 *
 * The production build is served automatically; an already-running server is
 * reused so the suite can be run against the same instance the audits use.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Generous: the page runs GSAP sequences and the suite drives six engines on
     one machine. Failing a correct page for being slow is not a useful signal. */
  timeout: 75_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [["list"]],
  use: {
    baseURL: process.env.SITE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    { name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "edge", use: { ...devices["Desktop Chrome"], channel: "msedge" } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "iphone", use: { ...devices["iPhone 13"] } },
    { name: "android", use: { ...devices["Pixel 5"], channel: "chrome" } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 90_000,
  },
});
