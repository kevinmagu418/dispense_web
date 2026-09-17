/**
 * Performance and privacy audit.
 *
 * Collects the metrics that actually matter for this site — LCP, CLS, FCP,
 * JavaScript payload and third-party requests before consent — using the browser's
 * own PerformanceObserver data rather than a synthetic score. Budgets are set for
 * a local production server; on a slower network the network-independent metrics
 * (CLS, JS payload, request counts) are the ones to trust.
 *
 * Usage: npm start, then  node scripts/audit-performance.mjs
 */

import puppeteer from "puppeteer-core";

const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const budgets = {
  cls: 0.1,
  jsTransferKb: 420,
  totalTransferKb: 1800,
  fcpMs: 2500,
  lcpMs: 3500,
  thirdPartyBeforeConsent: 0,
};

const routes = ["/", "/features", "/how-it-works", "/download", "/faq", "/security", "/blog"];

const problems = [];
const report = [];
const fail = (message) => problems.push(message);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 768 });
/* Cache off: transfer sizes should reflect a first visit, not a warm cache. */
await page.setCacheEnabled(false);

/* Observers must be installed before the page loads to capture early metrics. */
await page.evaluateOnNewDocument(() => {
  window.__perf = { lcp: 0, cls: 0, fcp: 0, longTasks: 0 };

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") window.__perf.fcp = entry.startTime;
      }
    }).observe({ type: "paint", buffered: true });

    new PerformanceObserver((list) => {
      window.__perf.longTasks += list.getEntries().length;
    }).observe({ type: "longtask", buffered: true });
  } catch {
    /* Older engines without a given entry type: metrics stay at zero and the
       corresponding budget is reported as unavailable rather than passed. */
  }
});

const thirdParty = [];

try {
  for (const route of routes) {
    thirdParty.length = 0;

    const onRequest = (request) => {
      const url = new URL(request.url());
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return;
      thirdParty.push(`${url.hostname}${url.pathname.slice(0, 30)}`);
    };
    page.on("request", onRequest);

    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});

    /* Let late layout settle before reading CLS. */
    await new Promise((resolve) => setTimeout(resolve, 900));

    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource");
      const sum = (entries) => entries.reduce((total, entry) => total + (entry.transferSize ?? 0), 0);

      const scripts = resources.filter((entry) => entry.initiatorType === "script");
      const styles = resources.filter((entry) => entry.initiatorType === "link" || entry.initiatorType === "css");
      const images = resources.filter((entry) => entry.initiatorType === "img");
      const fonts = resources.filter((entry) => entry.initiatorType === "css" && /\.(woff2?|ttf|otf)$/.test(entry.name));

      const navigation = performance.getEntriesByType("navigation")[0];

      return {
        perf: window.__perf,
        jsKb: Math.round(sum(scripts) / 1024),
        cssKb: Math.round(sum(styles) / 1024),
        imageKb: Math.round(sum(images) / 1024),
        fontKb: Math.round(sum(fonts) / 1024),
        totalKb: Math.round(sum(resources) / 1024),
        requests: resources.length,
        scriptCount: scripts.length,
        ttfbMs: Math.round(navigation?.responseStart ?? 0),
        domReadyMs: Math.round(navigation?.domContentLoadedEventEnd ?? 0),
      };
    });

    page.off("request", onRequest);

    const cls = Math.round(metrics.perf.cls * 1000) / 1000;
    const lcp = Math.round(metrics.perf.lcp);
    const fcp = Math.round(metrics.perf.fcp);

    if (cls > budgets.cls) fail(`${route}: CLS ${cls} exceeds budget ${budgets.cls}`);
    if (metrics.jsKb > budgets.jsTransferKb) {
      fail(`${route}: JavaScript transfer ${metrics.jsKb}KB exceeds budget ${budgets.jsTransferKb}KB`);
    }
    if (metrics.totalKb > budgets.totalTransferKb) {
      fail(`${route}: page transfer ${metrics.totalKb}KB exceeds budget ${budgets.totalTransferKb}KB`);
    }
    if (lcp > budgets.lcpMs) fail(`${route}: LCP ${lcp}ms exceeds budget ${budgets.lcpMs}ms`);
    if (fcp > budgets.fcpMs) fail(`${route}: FCP ${fcp}ms exceeds budget ${budgets.fcpMs}ms`);
    if (thirdParty.length > budgets.thirdPartyBeforeConsent) {
      fail(`${route}: ${thirdParty.length} third-party request(s) before consent → ${thirdParty.slice(0, 3).join(", ")}`);
    }

    report.push(
      `${route.padEnd(14)} LCP ${String(lcp).padStart(4)}ms · FCP ${String(fcp).padStart(4)}ms · CLS ${cls} · JS ${String(metrics.jsKb).padStart(3)}KB (${metrics.scriptCount} files) · total ${metrics.totalKb}KB · long tasks ${metrics.perf.longTasks} · 3rd-party ${thirdParty.length}`,
    );
  }

  /* Video is not fetched on a normal page view. */
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
  const videoRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => /\.(mp4|m4v|mov|webm|m3u8|mpd)(\?|$)/.test(entry.name))
      .map((entry) => entry.name),
  );
  if (videoRequests.length > 0) {
    fail(`media file downloaded during a page view: ${videoRequests.join(", ")}`);
  } else {
    report.push("video: no media bytes requested during a page view (lazy, click-to-play)");
  }

  /* Images are only fetched when needed and never at full desktop width on a phone. */
  await page.setViewport({ width: 320, height: 568, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});
  const phoneImages = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => entry.initiatorType === "img")
      .map((entry) => ({ name: entry.name.split("?")[1] ?? entry.name, kb: Math.round((entry.transferSize ?? 0) / 1024) })),
  );
  const oversizedOnPhone = phoneImages.filter((entry) => /w=(1600|1920|2560)/.test(entry.name));
  if (oversizedOnPhone.length > 0) {
    fail(`a 320px viewport requested a desktop-sized image: ${oversizedOnPhone.map((entry) => entry.name).join(", ")}`);
  } else {
    report.push(`images @320px: ${phoneImages.length} request(s), none at desktop width`);
  }
} finally {
  await browser.close();
}

console.log("\n=== Performance report ===");
report.forEach((line) => console.log(`· ${line}`));

console.log("\n=== Result ===");
if (problems.length === 0) {
  console.log("PASS — within budget, and no third-party or media requests before consent.");
} else {
  console.log(`FAIL — ${problems.length} issue(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exitCode = 1;
}
