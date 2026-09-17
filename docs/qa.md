# Quality assurance

How this site is verified, what is automated, and what still needs a human or a
real device. Every command below runs against the production build.

```bash
npm run build
npm start                     # or let Playwright start it (reuseExistingServer)
npm run verify                # routes, metadata, overflow, links, structured data
npm run audit:design          # mockup fit, type scale, contrast, tap targets, interactions
npm run audit:motion          # reduced-motion behaviour
npm run audit:consent         # consent gating, persistence, preferences panel
npm run audit:perf            # LCP / CLS / JS payload / third-party requests
npm run test:e2e              # Playwright: 6 browser projects, 60+ specs
```

`CHROME_PATH` overrides the browser binary used by the puppeteer-based audits
(default `C:/Program Files/Google/Chrome/Application/chrome.exe`).
`SITE_URL` points any audit at another origin.

---

## What each layer covers

| Layer | Script | Covers |
| --- | --- | --- |
| Route audit | `verify-site.mjs` | HTTP status, unique title/description/canonical/OG/Twitter, JSON-LD validity, single `<h1>`, no accidental `noindex`, horizontal overflow at 13 viewports (320 → 2560), clipped headings and button labels, body text under 12px, images without alt, buttons without accessible names, broken internal links, sitemap/robots/manifest presence and sitemap completeness |
| Craft audit | `audit-design.mjs` | Device-mockup overflow and headroom, type scale at 1440, contrast ratios (WCAG AA per text size), tap-target sizes at 390, mobile menu open/close/scroll-lock, FAQ accordion, pinned product story actually pinning and advancing, motion layer leaving nothing hidden, video section state |
| Reduced motion | `audit-reduced-motion.mjs` | Nothing hidden, nothing pinned, headings and copy still present, no pre-hide class applied |
| Consent | `audit-consent.mjs` | No tracking before a decision, no third-party request before consent, accept/reject/customise flows, versioned record, persistence across reloads, dialog semantics and keyboard behaviour, banner stepping aside for the mobile navigation |
| Performance | `audit-performance.mjs` | LCP, FCP, CLS, JavaScript transfer size, request counts, no third-party requests before consent, no media bytes on a page view, no desktop-sized image served to a 320px viewport |
| Video | `audit-video.mjs` | Exercises the native player against a temporary clip: lazy attach, play, pause, 25/50/75% milestones and completion, all consent-gated. Skips when no media is configured |
| End-to-end | `e2e/*.spec.ts` | Content and navigation, mobile navigation, FAQ, download page states, 404, consent flows, responsive overflow matrix, tap targets, keyboard focus, reduced motion, layout stability — across 6 browser projects |

## Verifying the video path

The site ships without a demo video, so the player is verified against a
throwaway clip rather than a real asset:

```bash
ffmpeg -y -f lavfi -i testsrc=size=1280x720:rate=25:duration=4   -pix_fmt yuv420p -c:v libx264 -preset veryfast -movflags +faststart   public/media/dispense-demo.mp4
npm run build && npm start
npm run audit:video
rm public/media/dispense-demo.mp4 && npm run build    # leave the repo clean
```

Observed on the last run: `video_loaded`, `video_play`, `video_pause`,
`video_25_percent`, `video_50_percent`, `video_75_percent`, `video_complete` — all
after consent, with no media bytes fetched until the section approached the
viewport. With no media present the section renders its coming-soon panel and the
audit exits 0 with a SKIP.

## Asset detection

Assets are discovered by `scripts/sync-assets.mjs`, which writes
`lib/asset-manifest.json` (run automatically as `predev`/`prebuild`). The app
imports that manifest instead of probing the filesystem during rendering, so
adding a file always invalidates the correct build cache entries — a filesystem
probe inside a page is invisible to the compiler and can be served from cache.

## Results on the current build

| Layer | Result |
| --- | --- |
| `npm run lint` / `npm run typecheck` | clean |
| `npm run build` | 16 routes, all prerendered |
| `npm run verify` | PASS — 9 routes × 13 viewports (320 → 2560), metadata, JSON-LD, links, sitemap |
| `npm run audit:design` | PASS — mockup fit, type scale, contrast (lowest 4.52:1), tap targets, pinned story, motion |
| `npm run audit:motion` | PASS — nothing hidden or pinned under reduced motion |
| `npm run audit:consent` | PASS — no tracking before consent, all flows, persistence, withdrawal, engagement cadence |
| `npm run audit:perf` | PASS — LCP 0.4–1.6 s, CLS ≈ 0, 219 KB JS, zero third-party requests before consent |
| `npm run audit:video` | PASS against a temporary clip (SKIPs cleanly with no media) |
| Playwright | chrome 32/32 · edge 32/32 · firefox ✓ · webkit ✓ · iphone ✓ · android ✓ |

## Browser coverage

The Playwright matrix is:

| Project | Engine | Notes |
| --- | --- | --- |
| `chrome` | Blink (system Chrome) | Desktop Chrome |
| `edge` | Blink (system Edge) | Edge desktop build |
| `firefox` | Gecko | Firefox desktop |
| `webkit` | WebKit | Closest available proxy for Safari on a Windows machine |
| `iphone` | WebKit, iPhone 13 viewport, touch | iOS behaviour: `svh` units, safe areas, touch targets |
| `android` | Blink, Pixel 5 viewport, touch | Chrome on Android behaviour |

Firefox and WebKit binaries are installed by Playwright
(`npx playwright install firefox webkit`); Chrome and Edge come from the machine.

### Still requires a real device

- Safari on macOS/iOS with the *address bar collapsing mid-scroll*. The WebKit
  build here does not reproduce URL-bar resizing, so `100svh` behaviour on real
  iOS deserves a manual pass. The pinned section uses `min-h-screen-safe`
  (`100vh` with a `100svh` override) specifically to make that case stable.
- Actual iOS Safari video playback, Picture-in-Picture and autoplay policy.
- Notch and home-indicator safe areas on hardware (the CSS uses
  `env(safe-area-inset-*)` on the header, the consent banner and the dialog; the
  emulation is approximate).
- Real Samsung Internet and Firefox for Android, if those are added to the
  supported list later.

## Running the suite on a loaded machine

Playwright drives several real engines at once. On this machine, running all six
projects in parallel occasionally produced `page.goto` timeouts on Firefox,
iPhone and Android — the pages themselves load in under a second in isolation
(measured: 873 ms for `/faq` with no contention), so those failures were resource
contention rather than page defects. `workers: 3` in the config is a compromise;
for a clean cross-engine run use:

```bash
npx playwright test --workers=1                  # all projects, sequentially
npx playwright test --project=firefox --workers=1
```

Chrome and Edge pass the whole suite in parallel without timeouts.

## Deliberate limitations, stated honestly

- **No fabricated analytics.** With no `NEXT_PUBLIC_ANALYTICS_ID` the site loads no
  vendor script at all; events are recorded only in an in-memory debug log so the
  instrumentation can be tested. No numbers in this repository are invented.
- **Clicks are not installs.** `android_download_click` / `ios_download_click`
  measure a click on a CTA. Install attribution needs a separate mechanism.
- **Iframe video analytics.** With a hosted embed, only events the provider
  actually exposes can be measured; the component records the load and does not
  guess play/completion data. The native `<video>` path reports loaded/play/pause/
  complete plus 25/50/75% milestones, which the element exposes itself.
- **Time on page is engagement, not attention.** Visible-time only, reported at
  15-second intervals, never as proof that somebody was looking.
- **JavaScript disabled.** Content is server-rendered, so the page reads without
  JavaScript. A `<noscript>` stylesheet also opens the FAQ panels and shows the
  mobile navigation links, but the accordion's `aria-expanded` state cannot be
  corrected without JavaScript — the copy is present and readable, the control's
  state label is simply not meaningful in that mode.
- **Lighthouse is not part of the pipeline.** `audit-perf` measures the same
  fundamentals (LCP, CLS, FCP, payload) from the browser's own performance
  timeline, with no extra dependency. A Lighthouse run in CI would be a reasonable
  future addition.
