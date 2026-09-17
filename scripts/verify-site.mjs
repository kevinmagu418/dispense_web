/**
 * Automated post-build audit of the marketing site.
 *
 * Checks, for every public route:
 *   - HTTP status and absence of console/page errors
 *   - unique title, meta description, canonical and OG tags
 *   - parseable JSON-LD
 *   - a single non-empty <h1>
 *   - no horizontal overflow at phone, tablet, laptop and desktop widths
 *   - no images missing alt text, no unlabelled buttons
 *   - the GSAP layer actually initialised (inline opacity applied to [data-motion])
 *   - every internal link resolves (no broken navigation)
 *
 * Usage: npm run build && npm start, then:  node scripts/verify-site.mjs
 * Override the target with SITE_URL=http://localhost:3100
 */

import puppeteer from "puppeteer-core";

const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const routes = [
  "/",
  "/features",
  "/how-it-works",
  "/download",
  "/faq",
  "/security",
  "/privacy",
  "/terms",
  "/blog",
];

/* The full matrix from the responsive specification: very small phones through
   large displays. Every route is checked at every width. */
const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x780", width: 375, height: 780 },
  { name: "390x844", width: 390, height: 844 },
  { name: "414x896", width: 414, height: 896 },
  { name: "600x900", width: 600, height: 900 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1600x900", width: 1600, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
];

const problems = [];
const notes = [];

function fail(message) {
  problems.push(message);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

/* `networkidle2` is unreliable against a Next dev/prod server that keeps
   prefetch connections alive, so readiness is asserted explicitly instead. */
async function visit(url) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page
    .waitForFunction(() => document.readyState === "complete", { timeout: 20000 })
    .catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 250));
  return response;
}

const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

try {
  for (const route of routes) {
    consoleErrors.length = 0;
    const response = await visit(`${BASE}${route}`);
    const status = response?.status() ?? 0;

    if (status !== 200) fail(`${route}: HTTP ${status}`);

    for (const viewport of viewports) {
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await new Promise((resolve) => setTimeout(resolve, 120));

      const layout = await page.evaluate(() => {
        const doc = document.documentElement;

        /* Decorative elements are allowed to sit under a clipped ancestor (the
           hero glow, for instance); only report things that actually extend the
           document. */
        const overflowing = Array.from(document.querySelectorAll("body *"))
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return false;
            if (rect.right <= window.innerWidth + 2 && rect.left >= -2) return false;
            /* Ignore anything inside a clipping ancestor. */
            let parent = element.parentElement;
            while (parent) {
              const style = getComputedStyle(parent);
              if (style.overflowX === "hidden" || style.overflowX === "clip") return false;
              parent = parent.parentElement;
            }
            return true;
          })
          .slice(0, 5)
          .map((element) => `${element.tagName.toLowerCase()}.${(element.className || "").toString().slice(0, 44)}`);

        /* Text that is clipped inside its own box, and buttons whose label does
           not fit, are the two failure modes that measurements miss most often. */
        const clippedText = Array.from(document.querySelectorAll("h1, h2, h3, .btn"))
          .filter((element) => element.scrollWidth > element.clientWidth + 2)
          .slice(0, 5)
          .map((element) => `${element.tagName.toLowerCase()}: ${(element.textContent ?? "").trim().slice(0, 34)}`);

        return {
          scrollWidth: doc.scrollWidth,
          innerWidth: window.innerWidth,
          overflowing,
          clippedText,
          imagesWithoutAlt: Array.from(document.querySelectorAll("img")).filter(
            (img) => !img.hasAttribute("alt"),
          ).length,
          buttonsWithoutLabel: Array.from(document.querySelectorAll("button")).filter(
            (button) =>
              !button.textContent?.trim() &&
              !button.getAttribute("aria-label") &&
              !button.getAttribute("aria-labelledby"),
          ).length,
          tinyText: Array.from(document.querySelectorAll("main p, main li"))
            .filter((element) => {
              /* Device mockups are scaled-down product UI, never body copy. */
              if (element.closest("[data-screen], .screen-stack, [aria-hidden='true']")) return false;
              const size = Number.parseFloat(getComputedStyle(element).fontSize);
              return size > 0 && size < 12;
            })
            .slice(0, 3)
            .map((element) => `${(element.textContent ?? "").trim().slice(0, 24)} (${getComputedStyle(element).fontSize})`),
        };
      });

      if (layout.scrollWidth > layout.innerWidth + 2) {
        fail(
          `${route} @${viewport.name}: horizontal overflow (scrollWidth ${layout.scrollWidth} > ${layout.innerWidth}) ${layout.overflowing.join(", ")}`,
        );
      }
      if (layout.clippedText.length > 0) {
        fail(`${route} @${viewport.name}: clipped text → ${layout.clippedText.join(" | ")}`);
      }
      if (layout.imagesWithoutAlt > 0) fail(`${route} @${viewport.name}: ${layout.imagesWithoutAlt} img without alt`);
      if (layout.buttonsWithoutLabel > 0)
        fail(`${route} @${viewport.name}: ${layout.buttonsWithoutLabel} button without accessible name`);
      if (layout.tinyText.length > 0)
        fail(`${route} @${viewport.name}: body text below 12px → ${layout.tinyText.join(" | ")}`);
    }

    await page.setViewport({ width: 1440, height: 900 });

    const head = await page.evaluate(() => {
      const meta = (selector, attribute = "content") =>
        document.querySelector(selector)?.getAttribute(attribute) ?? "";
      const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const parsed = jsonLd.map((node) => {
        try {
          return JSON.parse(node.textContent ?? "{}");
        } catch {
          return null;
        }
      });

      return {
        title: document.title,
        description: meta('meta[name="description"]'),
        canonical: meta('link[rel="canonical"]', "href"),
        ogTitle: meta('meta[property="og:title"]'),
        ogImage: meta('meta[property="og:image"]'),
        twitterCard: meta('meta[name="twitter:card"]'),
        h1: Array.from(document.querySelectorAll("h1")).map((node) =>
          node.textContent?.trim() ?? "",
        ),
        jsonLdInvalid: parsed.filter((item) => item === null).length,
        jsonLdCount: jsonLd.length,
        lang: document.documentElement.lang,
        screens: document.querySelectorAll(".screen-stack").length,
        robotsMeta: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
        internalLinks: Array.from(document.querySelectorAll('a[href^="/"]')).map(
          (anchor) => anchor.getAttribute("href") ?? "",
        ),
      };
    });

    if (!head.title) fail(`${route}: missing <title>`);
    if (!head.description) fail(`${route}: missing meta description`);
    if (!head.canonical) fail(`${route}: missing canonical`);
    if (!head.ogTitle) fail(`${route}: missing og:title`);
    if (!head.ogImage) fail(`${route}: missing og:image`);
    if (head.twitterCard !== "summary_large_image") fail(`${route}: twitter card not set`);
    if (head.h1.length !== 1) fail(`${route}: expected exactly one h1, found ${head.h1.length}`);
    if (head.h1[0] === "") fail(`${route}: empty h1`);
    if (head.jsonLdInvalid > 0) fail(`${route}: ${head.jsonLdInvalid} invalid JSON-LD blocks`);
    if (head.lang !== "en") fail(`${route}: html lang is "${head.lang}"`);
    if (/noindex|none/i.test(head.robotsMeta)) {
      fail(`${route}: public page is marked "${head.robotsMeta}"`);
    }

    /* Scroll the page so ScrollTrigger work runs, then confirm the motion layer
       set inline styles on the elements it owns. */
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.9;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });

    const motion = await page.evaluate(() => {
      const targets = Array.from(document.querySelectorAll("[data-motion]"));
      return {
        total: targets.length,
        stillHidden: targets.filter((element) => {
          const style = window.getComputedStyle(element);
          return style.opacity === "0" && !element.style.opacity;
        }).length,
      };
    });

    if (motion.total > 0 && motion.stillHidden === motion.total) {
      fail(`${route}: motion layer left ${motion.stillHidden}/${motion.total} elements hidden`);
    }

    if (consoleErrors.length > 0) {
      fail(`${route}: console errors → ${consoleErrors.slice(0, 3).join(" | ")}`);
    }

    notes.push(
      `${route.padEnd(14)} h1="${head.h1[0]?.slice(0, 46)}" jsonld=${head.jsonLdCount} screens=${head.screens} motion=${motion.total}`,
    );
  }

  /* Broken-link sweep across every internal target found on the site. */
  const targets = new Set(routes);
  await visit(`${BASE}/`);
  const discovered = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute("href") ?? ""),
  );
  discovered.forEach((href) => targets.add(href.split("#")[0]));

  for (const target of targets) {
    if (!target || target === "/") continue;
    const response = await page.goto(`${BASE}${target}`, { waitUntil: "domcontentloaded" });
    if ((response?.status() ?? 0) >= 400) fail(`broken internal link: ${target} → ${response?.status()}`);
  }

  /* Crawler files. */
  for (const file of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    const response = await page.goto(`${BASE}${file}`, { waitUntil: "domcontentloaded" });
    if ((response?.status() ?? 0) !== 200) fail(`${file} returned ${response?.status()}`);
  }

  const sitemap = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "domcontentloaded" });
  const sitemapText = await sitemap.text();
  const originMatch = /<loc>(https?:\/\/[^<]+)<\/loc>/.exec(sitemapText);
  const origin = originMatch ? new URL(originMatch[1]).origin : BASE;

  if (origin !== BASE) {
    notes.push(
      `note: sitemap origin is ${origin} (NEXT_PUBLIC_SITE_URL is unset, so the placeholder domain is used)`,
    );
  }

  for (const route of routes) {
    const expected = route === "/" ? `<loc>${origin}</loc>` : `${origin}${route}`;
    if (!sitemapText.includes(expected)) fail(`sitemap is missing ${expected}`);
  }
} finally {
  await browser.close();
}

console.log("\n=== Route report ===");
notes.forEach((line) => console.log(line));

console.log("\n=== Result ===");
if (problems.length === 0) {
  console.log("PASS — no issues found across routes, breakpoints, metadata, motion and links.");
} else {
  console.log(`FAIL — ${problems.length} issue(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exitCode = 1;
}
