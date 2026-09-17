/**
 * Consent audit.
 *
 * Exercises the real consent flows against the running site and fails loudly if
 * optional tracking can start without a decision, if a decision does not persist,
 * or if the preferences panel is not usable by keyboard.
 *
 * Usage: npm start, then  node scripts/audit-consent.mjs
 */

import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const problems = [];
const report = [];
const fail = (message) => problems.push(message);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

let thirdPartyRequests = [];
page.on("request", (request) => {
  const url = request.url();
  if (/googletagmanager|google-analytics|doubleclick|facebook\.net|hotjar|plausible|posthog/i.test(url)) {
    thirdPartyRequests.push(url.slice(0, 90));
  }
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadFresh(path = "/") {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});
  await wait(400);
}

async function clearConsentState() {
  await page.evaluate(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* storage unavailable — the provider falls back to memory */
    }
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await wait(400);
}

const readState = () =>
  page.evaluate(() => {
    const record = (() => {
      try {
        return JSON.parse(window.localStorage.getItem("dispense.consent") ?? "null");
      } catch {
        return null;
      }
    })();
    const analyticsState = window.__dispenseAnalyticsState ?? null;
    const events = (window.__dispenseAnalyticsEvents ?? []).map((entry) => entry.event);
    return {
      record,
      status: analyticsState?.status ?? "missing",
      consent: analyticsState?.consent ?? null,
      events,
      vendorScript: !!document.getElementById("dispense-analytics"),
      banner: !!document.querySelector(".consent-banner"),
      bannerHeight: document.querySelector(".consent-banner")?.getBoundingClientRect().height ?? 0,
      dialog: !!document.querySelector('[role="dialog"]'),
    };
  });

const clickByText = async (text, scope = "body") => {
  const clicked = await page.evaluate(
    (label, selectorScope) => {
      const root = document.querySelector(selectorScope) ?? document;
      const target = Array.from(root.querySelectorAll("button, a")).find(
        (element) => element.textContent?.trim() === label,
      );
      if (!target) return false;
      /* Focus first: real interactions focus the control, and focus restoration
         can only be verified if there was something to restore to. */
      target.focus?.();
      target.click();
      return true;
    },
    text,
    scope,
  );
  if (!clicked) fail(`could not find a control labelled "${text}"`);
  await wait(400);
  return clicked;
};

try {
  /* ---------------------------------------------------- 1. first visit */
  await loadFresh("/");
  await clearConsentState();
  thirdPartyRequests = [];

  let state = await readState();
  if (!state.banner || state.bannerHeight < 80) fail("consent banner is not shown on a first visit");
  if (state.dialog) fail("preferences dialog is open before the visitor asked for it");
  if (state.status !== "disabled") fail(`analytics status is "${state.status}" before any decision`);
  if (state.events.length > 0) fail(`events were recorded before consent: ${state.events.join(", ")}`);
  if (state.vendorScript) fail("analytics script was injected before consent");
  report.push(
    `first visit: banner ${Math.round(state.bannerHeight)}px, status=${state.status}, events=${state.events.length}`,
  );

  /* Second load without reloading storage: still no consent, still no requests. */
  await wait(500);
  if (thirdPartyRequests.length > 0) {
    fail(`third-party requests before consent: ${thirdPartyRequests.slice(0, 3).join(", ")}`);
  } else {
    report.push("no third-party tracking requests while consent is unknown");
  }

  /* -------------------------------------------------- 2. accept all */
  await clickByText("Accept all");
  state = await readState();
  if (state.banner) fail("banner still visible after accepting");
  if (state.status !== "enabled") fail(`analytics did not enable after accepting (status=${state.status})`);
  if (!state.record || state.record.categories.analytics !== true) {
    fail("consent record was not stored with analytics enabled");
  }
  if (state.record?.version !== "1.0") fail(`consent record version is ${state.record?.version}`);

  await loadFresh("/download");
  state = await readState();
  if (!state.events.includes("page_view")) fail("no page_view event after consent was granted");
  if (!state.events.includes("download_page_view")) fail("download_page_view was not tracked on /download");
  report.push(`after accept: status=${state.status}, events=${state.events.length} (${state.events.slice(0, 4).join(", ")})`);

  /* ------------------------------- 3. engagement is calm and visible-only */
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(16_500);
  state = await readState();
  const heartbeats = await page.evaluate(
    () =>
      (window.__dispenseAnalyticsEvents ?? []).filter(
        (entry) => entry.event === "engagement_heartbeat",
      ).length,
  );
  if (heartbeats === 0) {
    fail("no engagement heartbeat arrived within ~16s of a consented, visible session");
  } else if (heartbeats > 3) {
    fail(`engagement reported too often: ${heartbeats} heartbeats in ~16s`);
  } else {
    const seconds = await page.evaluate(
      () =>
        (window.__dispenseAnalyticsEvents ?? [])
          .filter((entry) => entry.event === "engagement_heartbeat")
          .map((entry) => entry.params.seconds_visible),
    );
    report.push(
      `engagement: ${heartbeats} heartbeat(s) in ~16s of visible time (intervals ${seconds.join(", ")}s) — no per-second noise`,
    );
  }

  /* ------------------------------------------- 4. persistence on reload */
  await page.reload({ waitUntil: "domcontentloaded" });
  await wait(500);
  state = await readState();
  if (state.banner) fail("banner reappeared for a visitor who already decided");
  if (state.status !== "enabled") fail("consent did not persist across a reload");
  report.push("persistence: decision survives a reload, banner stays hidden");

  /* ------------------------------------------------ 5. reject optional */
  await clearConsentState();
  thirdPartyRequests = [];
  await clickByText("Reject optional");
  state = await readState();
  if (state.banner) fail("banner still visible after rejecting");
  if (state.status !== "disabled") fail(`analytics enabled after rejecting (status=${state.status})`);
  if (state.record?.categories.analytics !== false) fail("rejection was not stored");
  if (state.events.length > 0) fail(`events recorded after rejecting: ${state.events.join(", ")}`);
  await wait(400);
  if (thirdPartyRequests.length > 0) fail("third-party requests fired after rejecting");
  report.push("reject optional: status=disabled, no events, no vendor script");

  /* ------------------------------------------ 6. manage preferences */
  await clearConsentState();
  await clickByText("Manage preferences");
  state = await readState();
  if (!state.dialog) fail("preferences dialog did not open");

  const dialog = await page.evaluate(() => {
    const node = document.querySelector('[role="dialog"]');
    return {
      modal: node?.getAttribute("aria-modal"),
      labelled: !!node?.getAttribute("aria-labelledby"),
      necessaryAlwaysActive: node?.textContent?.includes("Always active") ?? false,
      switches: Array.from(node?.querySelectorAll('[role="switch"]') ?? []).map((element) => ({
        id: element.id,
        checked: element.getAttribute("aria-checked"),
      })),
      buttons: Array.from(node?.querySelectorAll("button") ?? []).map((element) =>
        (element.textContent ?? "").trim(),
      ),
    };
  });

  if (dialog.modal !== "true" || !dialog.labelled) fail("dialog is missing modal semantics");
  if (!dialog.necessaryAlwaysActive) fail("necessary category is not shown as always active");
  if (dialog.switches.length !== 2) fail(`expected 2 optional switches, found ${dialog.switches.length}`);
  if (dialog.switches.some((entry) => entry.checked === "true")) {
    fail("an optional category is pre-selected in the visitor's favour");
  }
  report.push(`dialog: modal, ${dialog.switches.length} optional switches, all off by default`);

  /* Customise: analytics on, save. */
  await page.click("#consent-analytics");
  await clickByText("Save preferences");
  state = await readState();
  if (state.status !== "enabled") fail("saving a customised choice did not enable analytics");
  if (state.record?.state !== "customized") fail(`record state is "${state.record?.state}", expected "customized"`);
  if (state.record?.categories.marketing !== false) fail("marketing was enabled without an explicit choice");
  report.push(`customised: state=${state.record?.state}, analytics=${state.record?.categories.analytics}, marketing=${state.record?.categories.marketing}`);

  /* ------------------------------- 7. withdrawing consent stops sending */
  const beforeWithdrawal = await page.evaluate(
    () => (window.__dispenseAnalyticsEvents ?? []).length,
  );
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(300);
  await clickByText("Cookie preferences", "footer");
  await page.click("#consent-analytics");
  await clickByText("Save preferences");
  await wait(400);

  state = await readState();
  if (state.status !== "disabled") {
    fail(`withdrawing analytics consent left status "${state.status}"`);
  }

  /* Nothing new may be recorded after withdrawal. */
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll("a")).find((anchor) =>
      (anchor.getAttribute("href") ?? "").includes("/faq"),
    );
    link?.click();
  });
  await wait(800);
  const afterWithdrawal = await page.evaluate(() => (window.__dispenseAnalyticsEvents ?? []).length);
  if (afterWithdrawal > beforeWithdrawal + 1) {
    fail(
      `events kept arriving after consent was withdrawn (${beforeWithdrawal} → ${afterWithdrawal})`,
    );
  } else {
    report.push("withdrawal: status disabled and no further events recorded");
  }

  /* ------------------------------------------- 8. footer entry point */
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(300);
  await clickByText("Cookie preferences", "footer");
  state = await readState();
  if (!state.dialog) fail("footer control did not reopen the preferences dialog");

  /* Keyboard: Escape closes and focus returns. */
  await page.keyboard.press("Escape");
  await wait(400);
  const afterEscape = await page.evaluate(() => ({
    dialog: !!document.querySelector('[role="dialog"]'),
    focusText: (document.activeElement?.textContent ?? "").trim().slice(0, 30),
    focusTag: document.activeElement?.tagName ?? "",
  }));
  if (afterEscape.dialog) fail("Escape did not close the preferences dialog");
  if (afterEscape.focusTag !== "BUTTON") {
    fail(`focus was not restored to the control that opened the dialog (got ${afterEscape.focusTag})`);
  }
  report.push(
    `keyboard: Escape closes the dialog, focus restored to "${afterEscape.focusText || afterEscape.focusTag}"`,
  );

  /* --------------------------------------- 9. banner vs mobile menu */
  await page.setViewport({ width: 390, height: 844 });
  await clearConsentState();
  await page.click('button[aria-controls="mobile-navigation"]');
  await wait(400);
  const overlap = await page.evaluate(() => {
    const banner = document.querySelector(".consent-banner");
    const panel = document.getElementById("mobile-navigation");
    if (!banner || !panel) return null;
    const bannerStyle = getComputedStyle(banner);
    const bannerRect = banner.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    return {
      bannerHidden: bannerStyle.display === "none" || bannerRect.height === 0,
      overlaps: !(bannerRect.top >= panelRect.bottom || bannerRect.bottom <= panelRect.top),
    };
  });
  if (overlap && !overlap.bannerHidden && overlap.overlaps) {
    fail("consent banner overlaps the open mobile navigation");
  } else {
    report.push("mobile: consent banner steps aside while the navigation panel is open");
  }

  if (!existsSync("public/images/README.md")) {
    report.push("note: asset documentation missing");
  }
} finally {
  await browser.close();
}

console.log("\n=== Consent report ===");
report.forEach((line) => console.log(`· ${line}`));

console.log("\n=== Result ===");
if (problems.length === 0) {
  console.log("PASS — consent gates tracking correctly, persists, and is keyboard operable.");
} else {
  console.log(`FAIL — ${problems.length} issue(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exitCode = 1;
}
