/**
 * Generates the Open Graph / social share cards into public/images/og/.
 *
 * The cards are rendered by a real browser from the same design language as the
 * site (brand tokens, Manrope, the placeholder mark), so social previews look
 * like the product rather than a screenshot of it.
 *
 * Usage:  node scripts/generate-og.mjs
 *         npm run og:generate
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import puppeteer from "puppeteer-core";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = join(root, "public", "images", "og");
const fontPath = join(root, "assets", "fonts", "Manrope-Variable.ttf");

const SITE_LABEL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dispense.example")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const cards = [
  { slug: "home", eyebrow: "Personal finance", title: "Your money, organized around your life.", subtitle: "One balance for the day-to-day — and separate sub-wallets for rent, transport, groceries and savings." },
  { slug: "features", eyebrow: "Features", title: "Wallets, sub-wallets and money organization.", subtitle: "Personal wallet, purpose-based sub-wallets, scheduled payouts and a readable activity history." },
  { slug: "how-it-works", eyebrow: "How it works", title: "Five steps, then it runs itself.", subtitle: "Create an account, set up your money, split it by purpose, schedule payouts, track the results." },
  { slug: "download", eyebrow: "Download", title: "Take Dispense with you.", subtitle: "Android and iOS — store links, the waitlist and what you need before your first setup." },
  { slug: "faq", eyebrow: "FAQ", title: "Questions, answered plainly.", subtitle: "What Dispense is, how sub-wallets and payouts work, which platforms are supported, how to get help." },
  { slug: "security", eyebrow: "Security", title: "What we protect, and how.", subtitle: "Email verification, device verification, a PIN lock and encrypted transport — stated accurately." },
  { slug: "privacy", eyebrow: "Privacy", title: "Privacy policy.", subtitle: "What is collected, why it is collected, how it is protected, and how to ask about your data." },
  { slug: "terms", eyebrow: "Terms", title: "Terms of use.", subtitle: "Account responsibilities, scheduled payouts, availability and liability, in plain language." },
  { slug: "blog", eyebrow: "Blog", title: "Notes on everyday money.", subtitle: "Practical writing on organizing rent, transport and savings money instead of tracking it after the fact." },
];

const fontDataUri = `data:font/ttf;base64,${Buffer.from(
  await (await import("node:fs/promises")).readFile(fontPath),
).toString("base64")}`;

/* Use the supplied brand lockup when it exists; otherwise the placeholder mark
   drawn inline, so the cards are always composed. */
const logoCandidates = [
  join(root, "public", "images", "marketing", "dispense-logo.png"),
  join(root, "public", "dispense-word-logo.png"),
];
const logoPath = logoCandidates.find((candidate) => existsSync(candidate));

const brandMarkup = logoPath
  ? `<img src="data:image/png;base64,${Buffer.from(
      await (await import("node:fs/promises")).readFile(logoPath),
    ).toString("base64")}" style="height:42px;width:auto" alt="" />`
  : `<svg width="38" height="38" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#1565ff"/><rect x="7" y="9.2" width="18" height="3.4" rx="1.7" fill="#fff"/><rect x="7" y="14.3" width="13" height="3.4" rx="1.7" fill="#fff" fill-opacity="0.72"/><rect x="7" y="19.4" width="8" height="3.4" rx="1.7" fill="#fff" fill-opacity="0.46"/></svg>
      <span class="word">Dispense</span>`;

function html({ eyebrow, title, subtitle }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Manrope"; src: url("${fontDataUri}") format("truetype"); font-weight: 200 800; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: "Manrope", sans-serif; background: #f6f7fb; color: #0a1020; }
.card { position: relative; width: 1200px; height: 630px; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
.glow { position: absolute; inset: 0; background: radial-gradient(58% 64% at 20% 0%, rgba(21,101,255,0.20), rgba(21,101,255,0.05) 46%, transparent 74%); }
.grid { position: absolute; left: 0; right: 0; top: 0; height: 520px;
  background-image: linear-gradient(to right, rgba(10,16,32,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(10,16,32,0.05) 1px, transparent 1px);
  background-size: 68px 68px;
  -webkit-mask-image: radial-gradient(74% 72% at 28% 0%, #000 0%, transparent 78%);
  mask-image: radial-gradient(74% 72% at 28% 0%, #000 0%, transparent 78%); }
.top { position: relative; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 15px; }
.word { font-size: 30px; font-weight: 700; letter-spacing: -0.035em; }
.eyebrow { font-size: 14px; font-weight: 700; letter-spacing: 0.17em; text-transform: uppercase; color: #8d97ab;
  border: 1px solid #e4e7ee; background: #fff; border-radius: 9999px; padding: 9px 18px; }
.mid { position: relative; display: flex; flex-direction: column; gap: 24px; }
h1 { font-size: 64px; line-height: 1.05; letter-spacing: -0.033em; font-weight: 700; max-width: 940px; }
.sub { font-size: 23px; line-height: 1.5; color: #59637a; letter-spacing: -0.011em; max-width: 800px; }
.bottom { position: relative; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e4e7ee; padding-top: 24px; }
.url { font-size: 18px; font-weight: 600; color: #59637a; }
.chips { display: flex; gap: 10px; }
.chip { font-size: 14px; font-weight: 650; color: #0052d4; background: #f3f7ff; border: 1px solid #d6e3ff; border-radius: 9999px; padding: 8px 15px; }
</style></head>
<body><div class="card">
  <div class="glow"></div><div class="grid"></div>
  <div class="top">
    <div class="brand">${brandMarkup}</div>
    <span class="eyebrow">${eyebrow}</span>
  </div>
  <div class="mid"><h1>${title}</h1><p class="sub">${subtitle}</p></div>
  <div class="bottom">
    <span class="url">${SITE_LABEL}</span>
    <div class="chips"><span class="chip">Personal wallet</span><span class="chip">Sub-wallets</span><span class="chip">Scheduled payouts</span></div>
  </div>
</div></body></html>`;
}

const executablePath =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars", "--font-render-hinting=none"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  for (const card of cards) {
    const file = join(outDir, `og-${card.slug}.png`);
    const tmp = join(outDir, `.og-${card.slug}.html`);
    writeFileSync(tmp, html(card), "utf8");
    await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log(`wrote ${file}`);
  }
} finally {
  await browser.close();
}

const { unlinkSync, readdirSync } = await import("node:fs");
for (const entry of readdirSync(outDir)) {
  if (entry.startsWith(".og-")) unlinkSync(join(outDir, entry));
}

console.log(`\n${cards.length} Open Graph cards written to public/images/og/`);
