import { expect, test } from "@playwright/test";

/**
 * Responsive and accessibility checks.
 *
 * The overflow test intentionally inspects real elements rather than asserting
 * `overflow-x: hidden` somewhere: a layout that needs to be hidden is a bug, not
 * a pass.
 */

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x780", width: 375, height: 780 },
  { name: "414x896", width: 414, height: 896 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
];

const routes = ["/", "/features", "/how-it-works", "/download", "/faq", "/security", "/blog"];

test.describe("responsive layout", () => {
  for (const viewport of viewports) {
    test(`no horizontal overflow at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState("load");

        const overflow = await page.evaluate(() => {
          const offenders: string[] = [];
          for (const element of Array.from(document.querySelectorAll("body *"))) {
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            if (rect.right <= window.innerWidth + 2 && rect.left >= -2) continue;

            let parent = element.parentElement;
            let clipped = false;
            while (parent) {
              const style = getComputedStyle(parent);
              if (style.overflowX === "hidden" || style.overflowX === "clip") {
                clipped = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!clipped) {
              offenders.push(`${element.tagName.toLowerCase()}.${String(element.className).slice(0, 40)}`);
            }
          }

          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            offenders: offenders.slice(0, 4),
          };
        });

        expect(
          overflow.scrollWidth,
          `${route} overflows at ${viewport.name}: ${overflow.offenders.join(", ")}`,
        ).toBeLessThanOrEqual(overflow.innerWidth + 2);
      }
    });
  }

  test("interactive elements are large enough to tap at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ["/", "/download", "/faq"]) {
      await page.goto(route);
      await page.waitForLoadState("load");

      const tooSmall = await page.evaluate(() =>
        Array.from(document.querySelectorAll("main a, main button, header a, header button, footer a, footer button"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              label: (element.textContent ?? "").trim().slice(0, 28),
              height: Math.round(rect.height),
              width: Math.round(rect.width),
            };
          })
          .filter((item) => item.width > 2 && (item.height < 32 || item.width < 24)),
      );

      expect(tooSmall, `small tap targets on ${route}: ${JSON.stringify(tooSmall)}`).toEqual([]);
    }
  });

  test("keyboard focus reaches the primary navigation and reveals a focus ring", async ({ page }) => {
    await page.goto("/");

    /* The skip link must be the first focusable element in document order. Safari
       only moves Tab focus to links when "Full Keyboard Access" is enabled, so the
       equivalent assertion is made directly rather than by pressing Tab. */
    const firstFocusable = await page.evaluate(() => {
      const focusable = document.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      return {
        text: focusable?.textContent?.trim() ?? "",
        tag: focusable?.tagName ?? "",
        href: focusable?.getAttribute("href") ?? "",
      };
    });
    expect(firstFocusable.text).toBe("Skip to content");
    expect(firstFocusable.href).toBe("#main");

    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await skipLink.focus();
    await expect(skipLink).toBeFocused();

    /* Focus visibility is a CSS contract: the outline must not be removed. */
    const outline = await skipLink.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).not.toBe("none");
    expect(Number.parseFloat(outline.width)).toBeGreaterThan(0);
  });

  test("reduced motion keeps every word visible and unpins the story", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(700);

    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-motion]"))
        .filter((element) => element.getClientRects().length > 0)
        .filter((element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.9).length,
    );
    expect(hidden).toBe(0);

    /* The pinned sequence must not pin: the section scrolls normally. */
    const storyTop = await page.evaluate(() => {
      const section = document.getElementById("product-story");
      return section ? Math.round(section.getBoundingClientRect().top + window.scrollY) : null;
    });
    if (storyTop !== null) {
      await page.evaluate((top) => window.scrollTo(0, top + 900), storyTop);
      await page.waitForTimeout(500);
      /* The desktop pinned block is hidden below 1024px, and a display:none
         element reports top 0 — so check it is genuinely visible first. */
      const pinnedStill = await page.evaluate(() => {
        const node = document.querySelector<HTMLElement>("#product-story div.min-h-screen-safe");
        if (!node || node.getClientRects().length === 0) return "not-visible";
        return Math.round(node.getBoundingClientRect().top);
      });
      expect(pinnedStill === "not-visible" || pinnedStill !== 0).toBe(true);
    }

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("images are stable: no layout shift from media", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const cls = await page.evaluate(async () => {
      let total = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
            total += (entry as PerformanceEntry & { value: number }).value;
          }
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      observer.disconnect();
      return total;
    });

    expect(cls).toBeLessThan(0.1);
  });
});
