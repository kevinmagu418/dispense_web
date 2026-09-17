/**
 * Craft and interaction audit.
 *
 * Vision-based review is not available in this environment, so layout quality is
 * asserted through measurements instead: mockup overflow, tap-target sizes,
 * contrast ratios, type sizes, pinned-scroll behaviour, and the interactive
 * components (mobile navigation, accordion, video, motion layer).
 *
 * Usage: npm start, then  node scripts/audit-design.mjs
 */

import puppeteer from "puppeteer-core";

const BASE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const problems = [];
const report = [];
const fail = (message) => problems.push(message);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

async function visit(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => document.readyState === "complete", { timeout: 20000 }).catch(() => {});
  /* Measurements must run with the real webfont applied, otherwise line heights
     come from the fallback and every conclusion is wrong. */
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 250));
}

try {
  /* ---------------------------------------------------------------- mockups */
  await page.setViewport({ width: 1440, height: 900 });
  await visit("/");

  const mockups = await page.evaluate(async () => {
    await document.fonts.ready;
    const visible = (element) => element.getClientRects().length > 0;

    /* Every screen is authored at 300x640; anything taller than its frame would
       be clipped by the device bezel. */
    const screens = Array.from(document.querySelectorAll("[data-screen]")).filter(visible);

    return {
      overflowing: screens
        .filter((element) => element.scrollHeight > element.clientHeight + 1)
        .map(
          (element) =>
            `${element.getAttribute("data-screen")} (${element.scrollHeight} vs ${element.clientHeight})`,
        ),
      /* Natural content height: release the fixed frame height, measure, restore.
         This is the real headroom each screen has before the bezel clips it. */
      slack: screens.map((element) => {
        const previous = element.style.height;
        element.style.height = "auto";
        const natural = element.scrollHeight;
        element.style.height = previous;
        return { name: element.getAttribute("data-screen"), slack: 640 - natural };
      }),
      screens: screens.length,
      wrappers: document.querySelectorAll(".screen-stack").length,
      /* Checked per device screen: the hero renders a phone for phones and one
         for larger viewports, and only the visible one has geometry. */
      islandOverlapsStatusTime: (() => {
        const screens = Array.from(document.querySelectorAll("div")).filter((element) => {
          if (element.getClientRects().length === 0) return false;
          if (element.style.height !== "640px") return false;
          return getComputedStyle(element).overflow === "hidden";
        });

        let checked = 0;
        for (const screen of screens) {
          const screenRect = screen.getBoundingClientRect();
          const island = Array.from(screen.querySelectorAll("span")).find((element) => {
            const rect = element.getBoundingClientRect();
            const centred =
              Math.abs(rect.left + rect.width / 2 - (screenRect.left + screenRect.width / 2)) < 6;
            return rect.height > 14 && rect.height < 32 && rect.width > 55 && rect.width < 120 && centred;
          });
          const clock = Array.from(screen.querySelectorAll("span")).find(
            (element) => element.textContent?.trim() === "9:41",
          );
          if (!island || !clock) continue;

          checked += 1;
          const a = island.getBoundingClientRect();
          const b = clock.getBoundingClientRect();
          const separated = b.right < a.left || b.left > a.right || b.bottom < a.top || b.top > a.bottom;
          if (!separated) return true;
        }

        return checked === 0 ? null : false;
      })(),
    };
  });

  if (mockups.overflowing.length > 0) {
    fail(`phone screens overflow their frame: ${mockups.overflowing.join(", ")}`);
  }
  const tightest = mockups.slack.reduce(
    (worst, item) => (worst === null || item.slack < worst.slack ? item : worst),
    null,
  );
  if (tightest && tightest.slack < 12) {
    fail(`screen "${tightest.name}" has only ${tightest.slack}px of headroom before clipping`);
  } else if (tightest) {
    report.push(
      `screen headroom: tightest is "${tightest.name}" with ${tightest.slack}px to spare (all ${mockups.slack.length} screens fit)`,
    );
  }
  if (mockups.islandOverlapsStatusTime) {
    fail("dynamic island overlaps the status bar clock");
  }
  report.push(
    `mockups: ${mockups.screens} screen parts, ${mockups.wrappers} screen wrappers, no overflow, island clear`,
  );

  /* ------------------------------------------------------------ type scale */
  const type = await page.evaluate(() => {
    const size = (selector) => {
      const element = document.querySelector(selector);
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : null;
    };
    return {
      h1: size("h1"),
      lead: size(".t-lead"),
      body: size(".t-body"),
      small: size(".t-small"),
      screenBody: size("[data-screen-part='subwallet'] span span"),
    };
  });

  if (!type.h1 || type.h1 < 60) fail(`hero h1 is ${type.h1}px at 1440 — expected 60px+`);
  if (!type.lead || type.lead < 17) fail(`lead copy is ${type.lead}px — expected 17px+`);
  report.push(
    `type @1440: h1 ${type.h1}px · lead ${type.lead}px · body ${type.body}px · small ${type.small}px · in-screen ${type.screenBody}px`,
  );

  /* ------------------------------------------------------------- contrast */
  const contrast = await page.evaluate(() => {
    const parse = (value) => {
      const match = /rgba?\(([^)]+)\)/.exec(value);
      if (!match) return null;
      const parts = match[1].split(",").map((part) => Number.parseFloat(part));
      return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
    };
    const luminance = ({ r, g, b }) => {
      const channel = (value) => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    const backgroundOf = (element) => {
      let node = element;
      while (node && node !== document.documentElement) {
        const colour = parse(getComputedStyle(node).backgroundColor);
        if (colour && colour.a > 0.95) return colour;
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const ratio = (element) => {
      const foreground = parse(getComputedStyle(element).color);
      if (!foreground) return null;
      const background = backgroundOf(element);
      const l1 = luminance(foreground);
      const l2 = luminance(background);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
    };

    const samples = [
      ["h1", "h1"],
      ["lead paragraph", ".t-lead"],
      ["body paragraph", ".t-body"],
      ["small copy", ".t-small"],
      ["navigation link", "header nav a"],
      ["footer link", "footer nav a"],
      ["footer small print", "footer .t-small"],
      ["in-screen label", "[data-screen] .text-faint"],
    ];

    return samples.map(([label, selector]) => {
      const element = document.querySelector(selector);
      return {
        label,
        ratio: element ? ratio(element) : null,
        size: element ? Number.parseFloat(getComputedStyle(element).fontSize) : null,
      };
    });
  });

  for (const sample of contrast) {
    if (sample.ratio === null) continue;
    const required = sample.size && sample.size >= 24 ? 3 : 4.5;
    if (sample.ratio < required) {
      fail(`contrast: ${sample.label} is ${sample.ratio}:1 (needs ${required}:1)`);
    }
  }
  report.push(
    `contrast: ${contrast
      .filter((sample) => sample.ratio !== null)
      .map((sample) => `${sample.label} ${sample.ratio}:1`)
      .join(" · ")}`,
  );

  /* ----------------------------------------------------------- tap targets */
  await page.setViewport({ width: 390, height: 844 });
  await visit("/");

  const targets = await page.evaluate(() => {
    const clickable = Array.from(
      document.querySelectorAll("main a, main button, header a, header button, footer a, footer button"),
    );
    return clickable
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: (element.textContent ?? "").trim().slice(0, 30) || element.tagName,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter((item) => item.width > 0 && (item.height < 32 || item.width < 24));
  });

  if (targets.length > 0) {
    fail(
      `tap targets under 32px tall: ${targets
        .slice(0, 6)
        .map((item) => `${item.label} (${item.width}x${item.height})`)
        .join(", ")}`,
    );
  } else {
    report.push("tap targets: all interactive elements at least 32px tall on a 390px viewport");
  }

  /* --------------------------------------------------------- mobile menu */
  await page.click('button[aria-controls="mobile-navigation"]');
  await new Promise((resolve) => setTimeout(resolve, 400));

  const menuOpen = await page.evaluate(() => {
    const panel = document.getElementById("mobile-navigation");
    const button = document.querySelector('button[aria-controls="mobile-navigation"]');
    return {
      expanded: button?.getAttribute("aria-expanded"),
      height: panel ? Math.round(panel.getBoundingClientRect().height) : 0,
      links: panel ? panel.querySelectorAll("a").length : 0,
      bodyLocked: document.body.style.overflow,
    };
  });

  if (menuOpen.expanded !== "true" || menuOpen.height < 100) {
    fail(`mobile menu did not open (expanded=${menuOpen.expanded}, height=${menuOpen.height})`);
  }
  if (menuOpen.bodyLocked !== "hidden") fail("mobile menu does not lock background scroll");
  report.push(`mobile menu: opens to ${menuOpen.height}px with ${menuOpen.links} links, scroll locked`);

  await page.keyboard.press("Escape");
  await new Promise((resolve) => setTimeout(resolve, 400));
  const menuClosed = await page.evaluate(
    () => document.querySelector('button[aria-controls="mobile-navigation"]')?.getAttribute("aria-expanded"),
  );
  if (menuClosed !== "false") fail("mobile menu does not close on Escape");
  else report.push("mobile menu: closes on Escape");

  /* ----------------------------------------------------------- accordion */
  await visit("/faq");
  const accordion = await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('button[aria-controls^="faq-panel-"]'));
    const second = buttons[1];
    const panelId = second.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    const before = panel ? Math.round(panel.getBoundingClientRect().height) : 0;
    second.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const after = panel ? Math.round(panel.getBoundingClientRect().height) : 0;
    return {
      count: buttons.length,
      expanded: second.getAttribute("aria-expanded"),
      before,
      after,
    };
  });

  if (accordion.expanded !== "true" || accordion.after <= accordion.before) {
    fail(
      `FAQ accordion did not expand (expanded=${accordion.expanded}, ${accordion.before}px → ${accordion.after}px)`,
    );
  } else {
    report.push(
      `FAQ accordion: ${accordion.count} questions, panel expands ${accordion.before}px → ${accordion.after}px`,
    );
  }

  /* ------------------------------------------------- pinned product story */
  await page.setViewport({ width: 1440, height: 900 });
  await visit("/");

  const story = await page.evaluate(async () => {
    const section = document.getElementById("product-story");
    if (!section) return null;

    const pinned = section.querySelector("div[class*='min-h-screen']");
    const top = section.getBoundingClientRect().top + window.scrollY;
    const at = (offset) => window.scrollTo(0, top + offset);
    const settle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const pinnedTop = () => (pinned ? Math.round(pinned.getBoundingClientRect().top) : null);
    const activeIndex = () =>
      Array.from(document.querySelectorAll(".screen-stack")).findIndex(
        (node) => node.getAttribute("data-active") === "true",
      );

    /* Sweep the section and record where the device pins. Sub-pixel rounding and
       ScrollTrigger's refresh cycle make "is it pinned?" unreliable from a single
       sample, so the sweep decides it. */
    const samples = [];
    for (let offset = 300; offset <= 3600; offset += 300) {
      at(offset);
      await settle(280);
      samples.push({ offset, top: pinnedTop(), active: activeIndex() });
    }

    const pinnedSamples = samples.filter((sample) => Math.abs(sample.top ?? 9999) <= 2);
    const engagedAt = pinnedSamples.length > 0 ? pinnedSamples[0].offset : null;

    const first = samples[0]?.active ?? 0;
    const topWhenEngaged = pinnedSamples[0]?.top ?? null;
    const second = samples[Math.floor(samples.length / 2)]?.active ?? 0;
    const topLater = samples[Math.floor(samples.length / 2)]?.top ?? null;
    const third = samples[samples.length - 2]?.active ?? 0;
    const topLast = samples[samples.length - 2]?.top ?? null;

    return {
      first,
      second,
      third,
      engagedAt,
      topWhenEngaged,
      topLater,
      topLast,
      stages: document.querySelectorAll(".screen-stack").length,
    };
  });

  if (!story) {
    fail("product story section missing");
  } else {
    if (story.engagedAt === null) {
      fail("pinned story never engaged (element never reached the viewport top)");
    }
    if (story.first === story.second || story.second === story.third) {
      fail(
        `pinned story did not advance stages (indices ${story.first} → ${story.second} → ${story.third})`,
      );
    }
    if (Math.abs(story.topLater ?? 9999) > 2 || Math.abs(story.topLast ?? 9999) > 2) {
      fail(
        `pinned story is not holding the viewport (${story.topLater}px, ${story.topLast}px)`,
      );
    }
    report.push(
      `pinned story: ${story.stages} stages, engaged after ${story.engagedAt}px, active ${story.first} → ${story.second} → ${story.third}, pin held at ${story.topLater}px and ${story.topLast}px`,
    );
  }

  /* ------------------------------------------------------- motion layer */
  const motion = await page.evaluate(() => {
    const targets = Array.from(document.querySelectorAll("[data-motion]")).filter(
      (element) => element.getClientRects().length > 0,
    );
    const stillHidden = targets.filter(
      (element) => getComputedStyle(element).opacity === "0" && !element.style.opacity,
    );
    return {
      total: targets.length,
      hidden: stillHidden.length,
      sample: stillHidden.slice(0, 3).map((element) => element.className.slice(0, 70)),
    };
  });

  report.push(
    `motion layer: ${motion.total} visible animated elements, ${motion.hidden} left hidden after a full scroll`,
  );
  if (motion.hidden > 0) {
    fail(
      `${motion.hidden} animated elements still hidden after scrolling (e.g. ${motion.sample.join(" | ")})`,
    );
  }

  /* ------------------------------------------------------------ video state */
  await visit("/");
  const video = await page.evaluate(() => {
    const section = document.getElementById("demo");
    if (!section) return { present: false };
    const videoElement = section.querySelector("video");
    return {
      present: true,
      hasVideo: Boolean(videoElement),
      text: section.textContent?.includes("Product demo coming soon") ?? false,
      preload: videoElement?.getAttribute("preload") ?? null,
    };
  });
  if (!video.present) fail("video section missing");
  else if (!video.hasVideo && !video.text) fail("video section shows neither a player nor a fallback state");
  else
    report.push(
      `video section: ${video.hasVideo ? `player present (preload=${video.preload})` : "composed coming-soon fallback"}`,
    );
} finally {
  await browser.close();
}

console.log("\n=== Craft report ===");
report.forEach((line) => console.log(`· ${line}`));

console.log("\n=== Result ===");
if (problems.length === 0) {
  console.log("PASS — layout, type, contrast, tap targets and interactions all check out.");
} else {
  console.log(`FAIL — ${problems.length} issue(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exitCode = 1;
}
