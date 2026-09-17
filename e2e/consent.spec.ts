import { expect, test } from "@playwright/test";

/**
 * Cookie consent flows.
 *
 * These are the tests that matter most for privacy: they assert that nothing is
 * measured before a decision, that a decision persists, and that the preference
 * centre is genuinely usable rather than decorative.
 */

const banner = (page: import("@playwright/test").Page) => page.locator(".consent-banner");

test.describe("cookie consent", () => {
  test("banner appears for a new visitor and no tracking starts", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (request) => {
      if (/googletagmanager|google-analytics|doubleclick/i.test(request.url())) {
        thirdParty.push(request.url());
      }
    });

    await page.goto("/");

    /* WebKit on a loaded machine can take a moment to hydrate; wait explicitly
       rather than relying on the default assertion timeout. */
    await page.waitForSelector(".consent-banner", { timeout: 25_000 });
    await expect(banner(page)).toBeVisible();
    await expect(page.getByRole("heading", { name: "We use cookies" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Accept all" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject optional" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Manage preferences" })).toBeVisible();

    const state = await page.evaluate(() => window.__dispenseAnalyticsState);
    expect(state?.status).toBe("disabled");

    const events = await page.evaluate(() => window.__dispenseAnalyticsEvents ?? []);
    expect(events).toHaveLength(0);

    await page.waitForTimeout(800);
    expect(thirdParty).toEqual([]);
  });

  test("accept all enables analytics, which then persists", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Accept all" }).click();

    await expect(banner(page)).toBeHidden();
    await expect
      .poll(async () => page.evaluate(() => window.__dispenseAnalyticsState?.status))
      .toBe("enabled");

    const stored = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem("dispense.consent") ?? "null"),
    );
    expect(stored?.categories.analytics).toBe(true);
    expect(stored?.version).toBe("1.0");

    await page.reload();
    await expect(banner(page)).toBeHidden();
    await expect
      .poll(async () => page.evaluate(() => window.__dispenseAnalyticsState?.status))
      .toBe("enabled");

    /* The download funnel is measurable once consent exists. */
    await page.goto("/download");
    await expect
      .poll(async () =>
        page.evaluate(() => (window.__dispenseAnalyticsEvents ?? []).map((entry) => entry.event)),
      )
      .toContain("download_page_view");
  });

  test("reject optional keeps analytics off", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Reject optional" }).click();

    await expect(banner(page)).toBeHidden();
    await expect
      .poll(async () => page.evaluate(() => window.__dispenseAnalyticsState?.status))
      .toBe("disabled");

    const events = await page.evaluate(() => window.__dispenseAnalyticsEvents ?? []);
    expect(events).toHaveLength(0);

    /* Navigating does not start measuring either. */
    await page.goto("/features");
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => window.__dispenseAnalyticsEvents ?? [])).toHaveLength(0);
  });

  test("preferences can be customised and are remembered", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Manage preferences" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByText("Always active")).toBeVisible();

    const analyticsSwitch = dialog.getByRole("switch").first();
    await expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");

    await analyticsSwitch.click();
    await expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");

    await dialog.getByRole("button", { name: "Save preferences" }).click();
    await expect(dialog).toBeHidden();

    await expect
      .poll(async () => page.evaluate(() => window.__dispenseAnalyticsState?.status))
      .toBe("enabled");

    const stored = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem("dispense.consent") ?? "null"),
    );
    expect(stored?.state).toBe("customized");
    expect(stored?.categories.analytics).toBe(true);
    expect(stored?.categories.marketing).toBe(false);

    /* Marketing was never switched on, even though the architecture supports it. */
    await page.reload();
    await expect(banner(page)).toBeHidden();
  });

  test("preferences close with Escape and with the close control", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Manage preferences" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Manage preferences" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Close cookie preferences" })
      .click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("preferences can be reopened from the footer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Reject optional" }).click();

    await page.locator("footer").getByRole("button", { name: "Cookie preferences" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    /* Consent is not a one-time choice: switching analytics on here works too. */
    await dialog.getByRole("switch").first().click();
    await dialog.getByRole("button", { name: "Save preferences" }).click();
    await expect
      .poll(async () => page.evaluate(() => window.__dispenseAnalyticsState?.status))
      .toBe("enabled");
  });

  test("banner does not obstruct the page or the mobile navigation", async ({ page }) => {
    /* Phone viewport on every engine: the hero CTA and the menu panel must both
       stay usable with the banner on screen. */
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(banner(page)).toBeVisible();

    /* The primary hero CTA must remain clickable with the banner visible. */
    const heroCta = page.getByRole("link", { name: "Download Dispense" }).first();
    await expect(heroCta).toBeVisible();
    await heroCta.click();
    await expect(page).toHaveURL(/\/download$/);

    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(banner(page)).toBeHidden();
  });
});
