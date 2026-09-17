import puppeteer from "puppeteer-core";

const BASE = process.env.SITE_URL ?? "http://localhost:3101";
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const messages = [];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

page.on("console", (message) => {
  const type = message.type();
  if (type === "error" || type === "warning") messages.push(`${type}: ${message.text().slice(0, 220)}`);
});
page.on("pageerror", (error) => messages.push(`pageerror: ${error.message.slice(0, 220)}`));

for (const route of ["/", "/features", "/download", "/how-it-works"]) {
  messages.length = 0;
  await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.readyState === "complete", { timeout: 40000 }).catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const hydration = messages.filter((message) => /hydrat|mismatch|did not match/i.test(message));
  console.log(
    `${route.padEnd(14)} console messages: ${messages.length} (hydration-related: ${hydration.length})`,
  );
  messages.slice(0, 6).forEach((message) => console.log(`   ${message}`));
}

await browser.close();
