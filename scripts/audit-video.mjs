/**
 * Video instrumentation check.
 *
 * Verifies that the native player emits its analytics events — but only when a
 * media file actually exists, because there is nothing honest to measure
 * otherwise. To exercise it, generate a throwaway clip first (ffmpeg), build, and
 * serve:
 *
 *   ffmpeg -y -f lavfi -i testsrc=size=1280x720:rate=25:duration=4 \
 *     -pix_fmt yuv420p -c:v libx264 -preset veryfast -movflags +faststart \
 *     public/media/dispense-demo.mp4
 *   npm run build && npm start
 *   npm run audit:video
 *   rm public/media/dispense-demo.mp4 && npm run build     # leave the repo clean
 *
 * Prints SKIP (exit 0) when no media is present, so it is safe in a full sweep.
 *
 * Usage: node scripts/audit-video.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";

const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const here = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(here, "..", "lib", "asset-manifest.json");
const mediaConfigured = (() => {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    return Boolean(manifest.demoVideo || manifest.demoVideoPoster);
  } catch {
    return false;
  }
})();

const problems = [];
const report = [];
const fail = (message) => problems.push(message);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

try {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});

  /* Consent first: the events under test are consent-gated, so wait for the
     banner to be rendered (hydration) before answering it. */
  await page.waitForSelector(".consent-banner button", { timeout: 15000 }).catch(() => {});
  const accepted = await page.evaluate(() => {
    const accept = Array.from(document.querySelectorAll(".consent-banner button")).find(
      (button) => button.textContent?.trim() === "Accept all",
    );
    accept?.click();
    return Boolean(accept);
  });
  if (!accepted) fail("could not answer the consent banner, so no event can be verified");
  await page
    .waitForFunction(() => window.__dispenseAnalyticsState?.status === "enabled", { timeout: 10000 })
    .catch(() => fail("analytics did not enable after accepting consent"));
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!mediaConfigured) {
    console.log(
      "SKIP — no media configured, so the section correctly shows its coming-soon state.",
    );
    console.log("       See the header of this script for the temporary-clip procedure.");
    process.exitCode = 0;
    await browser.close();
    process.exit(0);
  }

  /* Scroll the section into view: the player mounts only once it is approached. */
  await page.evaluate(() => document.getElementById("demo")?.scrollIntoView({ block: "center" }));

  const appeared = await page
    .waitForSelector("#demo video", { timeout: 15000 })
    .then(() => true)
    .catch(() => false);

  if (!appeared) {
    fail("media is configured but the player never mounted once the section was in view");
  } else {
    report.push("video element rendered from the supplied media file");

    await page.waitForFunction(() => Boolean(document.querySelector("#demo video")?.currentSrc), {
      timeout: 15000,
    });
    report.push("lazy load: media attached once the section approached the viewport");

    await page.click("#demo button");
    await page.waitForFunction(() => document.querySelector("#demo video")?.paused === false, {
      timeout: 15000,
    });

    /* Pause mid-clip, resume, then let it finish: pause and completion both run. */
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await page.evaluate(() => document.querySelector("#demo video")?.pause());
    await new Promise((resolve) => setTimeout(resolve, 300));
    await page.evaluate(() => document.querySelector("#demo video")?.play());
    await page.waitForFunction(() => document.querySelector("#demo video")?.ended === true, {
      timeout: 25000,
    });

    const events = await page.evaluate(() =>
      (window.__dispenseAnalyticsEvents ?? []).map((entry) => entry.event),
    );

    for (const expected of [
      "video_loaded",
      "video_play",
      "video_pause",
      "video_25_percent",
      "video_50_percent",
      "video_75_percent",
      "video_complete",
    ]) {
      if (!events.includes(expected)) fail(`missing video event: ${expected}`);
    }

    report.push(`events observed: ${events.filter((event) => event.startsWith("video")).join(", ")}`);
  }
} finally {
  await browser.close();
}

console.log("\n=== Video report ===");
report.forEach((line) => console.log(`· ${line}`));

console.log("\n=== Result ===");
if (problems.length === 0) {
  console.log("PASS — the player emits loaded/play/pause/progress/complete under consent.");
} else {
  console.log(`FAIL — ${problems.length} issue(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exitCode = 1;
}
