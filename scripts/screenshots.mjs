/**
 * Reference screenshots.
 *
 * Captures each route at desktop and phone widths with the consent decision
 * already stored (so the banner does not sit over the design being reviewed),
 * plus dedicated captures of the consent banner and the preference centre.
 *
 * Usage: npm start (in another terminal)  →  npm run screenshots
 * Output: screenshots/*.png  (git-ignored)
 */

import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "screenshots");
const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const shots = [
  { route: "/", full: false },
  { route: "/", full: true, suffix: "full" },
  { route: "/features", full: false },
  { route: "/how-it-works", full: false },
  { route: "/download", full: false },
  { route: "/faq", full: false },
  { route: "/security", full: false },
  { route: "/privacy", full: false },
  { route: "/blog", full: false },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2 },
  { name: "small", width: 320, height: 568, deviceScaleFactor: 2 },
];

const ACCEPTED_CONSENT = {
  version: "1.0",
  state: "accepted",
  categories: { necessary: true, analytics: false, marketing: false },
  decidedAt: new Date().toISOString(),
};

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

const settle = async () => {
  await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  /* Walk the page so scroll-triggered sections settle into their final state. */
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 400));
  });
};

try {
  for (const viewport of viewports) {
    const onlySmall = viewport.name === "small";

    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor,
    });

    /* Pages below are captured with consent already stored. */
    await page.evaluateOnNewDocument((record) => {
      try {
        window.localStorage.setItem("dispense.consent", JSON.stringify(record));
      } catch {
        /* storage unavailable: the banner will simply appear in the capture */
      }
    }, ACCEPTED_CONSENT);

    for (const shot of shots) {
      if (onlySmall && !["/", "/download"].includes(shot.route)) continue;
      if (viewport.name !== "desktop" && shot.suffix === "full") continue;

      await page.goto(`${BASE}${shot.route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle();

      const name = `${shot.route === "/" ? "home" : shot.route.replace(/\//g, "")}${
        shot.suffix ? `-${shot.suffix}` : ""
      }-${viewport.name}.png`;

      await page.screenshot({ path: join(outDir, name), fullPage: Boolean(shot.full) });
      console.log(`captured ${name}`);
    }

    /* Consent states: banner on a first visit, and the preference centre. */
    if (viewport.name !== "small") {
      await page.evaluateOnNewDocument(() => {
        try {
          window.localStorage.removeItem("dispense.consent");
        } catch {
          /* ignore */
        }
      });
      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle();
      await page.screenshot({ path: join(outDir, `consent-banner-${viewport.name}.png`) });
      console.log(`captured consent-banner-${viewport.name}.png`);

      await page.evaluate(() => {
        const manage = Array.from(document.querySelectorAll("button")).find(
          (button) => button.textContent?.trim() === "Manage preferences",
        );
        manage?.click();
      });
      await new Promise((resolve) => setTimeout(resolve, 700));
      await page.screenshot({ path: join(outDir, `consent-preferences-${viewport.name}.png`) });
      console.log(`captured consent-preferences-${viewport.name}.png`);
    }
  }
} finally {
  await browser.close();
}

console.log(`\nScreenshots written to ${outDir}`);
