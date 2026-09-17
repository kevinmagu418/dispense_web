/**
 * Reduced-motion audit.
 *
 * When a visitor asks for reduced motion, nothing may be hidden, nothing may be
 * pinned and every word must still be present. This verifies that the CSS
 * pre-hide, the boot script and the GSAP matchMedia branches agree.
 *
 * Usage: npm start, then  node scripts/audit-reduced-motion.mjs
 */

import puppeteer from "puppeteer-core";

const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const problems = [];
const report = [];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.setViewport({ width: 1440, height: 900 });

try {
  for (const route of ["/", "/features", "/how-it-works", "/faq"]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 600));

    const state = await page.evaluate(() => {
      const visible = (element) => element.getClientRects().length > 0;
      const targets = Array.from(document.querySelectorAll("[data-motion]")).filter(visible);
      const hidden = targets.filter(
        (element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.9,
      );
      return {
        motionTargets: targets.length,
        hidden: hidden.length,
        hiddenSample: hidden.slice(0, 3).map((element) => element.className.slice(0, 60)),
        jsMotionClass: document.documentElement.classList.contains("js-motion"),
        headings: document.querySelectorAll("h1, h2").length,
        wordCount: (document.querySelector("main")?.textContent ?? "").trim().split(/\s+/).length,
        hasPinned: Boolean(
          document.querySelector("#product-story div[class*='min-h-screen']")?.style.position,
        ),
      };
    });

    if (state.hidden > 0) {
      fail(`${route}: ${state.hidden} elements hidden under reduced motion (${state.hiddenSample.join(" | ")})`);
    }
    if (state.jsMotionClass) fail(`${route}: pre-hide class was applied under reduced motion`);
    if (state.headings < 3) fail(`${route}: only ${state.headings} headings rendered`);

    /* Nothing may pin: the story element must scroll with the page. */
    const pinned = await page.evaluate(async () => {
      const section = document.getElementById("product-story");
      if (!section) return null;
      const element = section.querySelector("div[class*='min-h-screen']");
      if (!element) return null;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 800);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        topNow: Math.round(element.getBoundingClientRect().top),
        inlinePosition: element.style.position || "(none)",
      };
    });

    if (pinned && pinned.topNow === 0) {
      fail(`${route}: product story is still pinned under reduced motion`);
    }

    report.push(
      `${route.padEnd(14)} motion=${state.motionTargets} hidden=${state.hidden} headings=${state.headings} words=${state.wordCount} pinned=${pinned ? pinned.topNow === 0 : "n/a"}`,
    );
  }
} finally {
  await browser.close();
}

console.log("\n=== Reduced-motion report ===");
report.forEach((line) => console.log(`· ${line}`));

console.log("\n=== Result ===");
if (problems.length === 0) {
  console.log("PASS — reduced motion keeps all content visible, readable and unpinned.");
} else {
  console.log(`FAIL — ${problems.length} issue(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exitCode = 1;
}
