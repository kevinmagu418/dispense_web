import puppeteer from "puppeteer-core";

const BASE = process.env.SITE_URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

for (const route of ["/", "/features", "/how-it-works"]) {
  await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.readyState === "complete").catch(() => {});
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
  });

  const measurements = await page.evaluate(async () => {
    await document.fonts.ready;
    return Array.from(document.querySelectorAll("[data-screen]")).map((element) => {
      const content = element.querySelector(":scope > div.min-h-0");
      return {
        name: element.getAttribute("data-screen"),
        frameScroll: element.scrollHeight,
        frameClient: element.clientHeight,
        contentScroll: content ? content.scrollHeight : 0,
        contentHeight: content ? Math.round(content.getBoundingClientRect().height) : 0,
      };
    });
  });

  const worst = new Map();
  for (const item of measurements) {
    const key = item.name ?? "?";
    const current = worst.get(key);
    if (!current || item.contentScroll > current.contentScroll) worst.set(key, item);
  }

  console.log(`\n${route}`);
  for (const [name, item] of [...worst.entries()].sort(
    (a, b) => b[1].contentScroll - a[1].contentScroll,
  )) {
    const slack = 640 - item.contentScroll;
    const flag = slack < 12 ? `  <-- only ${slack}px slack` : "";
    console.log(
      `  ${String(name).padEnd(20)} content column ${String(item.contentScroll).padStart(3)}px / 640px (slack ${String(slack).padStart(3)}px)${flag}`,
    );
  }
}

await browser.close();
