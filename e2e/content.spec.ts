import { expect, test, type Page } from "@playwright/test";

/**
 * Core content and navigation flows.
 *
 * Runs on every engine in the matrix, so it doubles as the cross-browser smoke
 * test: if Firefox or WebKit renders a blank hero or a broken link, this fails.
 */

const routes = [
  { path: "/", heading: /organized around your life/i },
  { path: "/features", heading: /Everything Dispense does/i },
  { path: "/how-it-works", heading: /Five steps/i },
  { path: "/download", heading: /Take Dispense with you/i },
  { path: "/faq", heading: /Questions, answered plainly/i },
  { path: "/security", heading: /What we protect, and how/i },
  { path: "/blog", heading: /Notes on everyday money/i },
];

async function failOnConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text().slice(0, 200));
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message.slice(0, 200)}`));
  return errors;
}

test.describe("content and navigation", () => {
  for (const route of routes) {
    test(`${route.path} renders its content`, async ({ page }) => {
      const errors = await failOnConsoleErrors(page);

      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toContainText(route.heading);
      await expect(page).toHaveTitle(/Dispense/);

      /* Essential copy is server-rendered: it must be present without waiting for
         any animation to run. */
      const bodyText = await page.locator("main").innerText();
      expect(bodyText.trim().length).toBeGreaterThan(400);

      await page.waitForTimeout(600);
      expect(errors, `console errors on ${route.path}`).toEqual([]);
    });
  }

  test("navbar links navigate to each page", async ({ page }) => {
    /* The horizontal nav is desktop-only (the hamburger takes over below 1024px),
       so this test pins a desktop viewport on every project. */
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    for (const route of routes.slice(1, 5)) {
      const label = { "/features": "Features", "/how-it-works": "How it works", "/download": "Download", "/faq": "FAQ" }[
        route.path
      ] as string;

      const link = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label });
      if (label === "Download") continue; // the primary CTA is covered by the download specs
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${route.path.replace(/\//g, "\\/")}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("mobile navigation opens, closes on Escape and on selection", async ({ page }) => {
    /* Explicit phone viewport so this runs on every engine, not just the mobile
       projects — the panel is the same code path everywhere. */
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });

    await expect(toggle).toBeVisible();
    await toggle.click();

    const panel = page.locator("#mobile-navigation");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    /* Background scroll is locked while the panel is open. */
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");

    /* Reopen and navigate: the panel must close itself. */
    await page.getByRole("button", { name: "Open menu" }).click();
    await panel.getByRole("link", { name: /FAQ/ }).click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("FAQ accordion opens and closes", async ({ page }) => {
    await page.goto("/faq");

    const trigger = page.locator('button[aria-controls^="faq-panel-"]').nth(1);
    const panelId = await trigger.getAttribute("aria-controls");
    const panel = page.locator(`#${panelId}`);

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("download page shows platform availability or an honest placeholder", async ({ page }) => {
    await page.goto("/download");

    const android = page.getByRole("heading", { name: "Android" });
    const ios = page.getByRole("heading", { name: /iOS|iPhone/i });

    await expect(android).toBeVisible();
    await expect(ios).toBeVisible();

    /* Store links do not exist yet, so either a real link or the waitlist state
       must be present — never a dead link. */
    const storeLinks = page.locator('a[href^="http"]').filter({ hasText: /Download for/ });
    if ((await storeLinks.count()) === 0) {
      await expect(page.getByText(/Not yet available/i).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /Get the link/i }).first()).toHaveAttribute(
        "href",
        /^mailto:/,
      );
    } else {
      for (const link of await storeLinks.all()) {
        await expect(link).toHaveAttribute("href", /^https?:\/\//);
      }
    }
  });

  test("client-side navigation leaves no stale pinned sections or errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));

    /* Desktop viewport: the pinned story only exists at >=1024px, and the links
       used below live in the desktop navigation. */
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const primary = page.getByRole("navigation", { name: "Primary" });

    /* Soft navigations: layout effects must clean up after themselves. */
    await primary.getByRole("link", { name: "Features" }).click();
    await expect(page).toHaveURL(/\/features$/);
    await primary.getByRole("link", { name: "How it works" }).click();
    await expect(page).toHaveURL(/\/how-it-works$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/features$/);
    await page.goto("/");

    /* ScrollTrigger wraps pinned elements in .pin-spacer; more than one after
       returning to a page whose story pins once means triggers leaked. */
    await page.waitForTimeout(900);
    expect(await page.locator(".pin-spacer").count()).toBeLessThanOrEqual(1);

    /* And the pinned story still works after the round trip. */
    const storyTop = await page.evaluate(() => {
      const section = document.getElementById("product-story");
      return section ? Math.round(section.getBoundingClientRect().top + window.scrollY) : null;
    });
    if (storyTop !== null) {
      await page.evaluate((top) => window.scrollTo(0, top + 1400), storyTop);
      await page.waitForTimeout(700);
      const active = await page.evaluate(
        () => Array.from(document.querySelectorAll(".screen-stack[data-active='true']")).length,
      );
      expect(active).toBe(1);
    }

    expect(errors).toEqual([]);
  });

  test("unknown routes return the styled 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/not been set up/i);
  });
});
