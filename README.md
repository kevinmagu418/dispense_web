# Dispense — marketing website

The official marketing and product site for Dispense: a premium, light-mode,
conversion-focused website that introduces the product, shows the app, explains
how it works and routes people to the download page.

It is **not** a web version of the mobile app. The app itself is Expo /
React Native; this site is Next.js and shares only the brand language.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

| Command                  | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run build`          | Production build (all routes prerender to static HTML)              |
| `npm start`              | Serve the production build                                          |
| `npm run typecheck`      | `tsc --noEmit`                                                       |
| `npm run lint`           | ESLint (Next core-web-vitals + TypeScript rules)                     |
| `npm run og:generate`    | Regenerate the Open Graph cards into `public/images/og/`             |
| `npm run verify`         | Route audit: metadata, JSON-LD, links, overflow, sitemap, motion     |
| `npm run audit:design`   | Craft audit: mockup fit, type scale, contrast, tap targets, interactions |
| `npm run audit:motion`   | Reduced-motion audit: nothing hidden, nothing pinned, all copy intact |
| `npm run screens`        | Measure every mockup screen's headroom against its device frame      |
| `npm run screenshots`    | Capture reference screenshots into `screenshots/`                    |
| `npm run audit:consent`  | Consent audit: no tracking before a decision, flows, persistence      |
| `npm run audit:perf`     | LCP / CLS / JS payload / third-party requests before consent         |
| `npm run audit:video`    | Video event wiring (SKIPs cleanly when no media is configured)        |
| `npm run assets:sync`    | Regenerate `lib/asset-manifest.json` from the public directory         |
| `npm run test:e2e`       | Playwright suite across Chrome, Edge, Firefox, WebKit, iPhone, Android |

A full pre-flight check (server must be running for the audits):

```bash
npm run typecheck && npm run lint && npm run build
npm run test:e2e                 # starts/reuses the server itself
npm start &                      # or in a second terminal
npm run verify && npm run audit:design && npm run audit:motion   && npm run audit:consent && npm run audit:perf
```

Full details of what each layer covers, the browser matrix and the checks that
still need a real device are in [docs/qa.md](docs/qa.md).

The three audit scripts are the review harness: they run a real browser against
the built site and fail loudly on missing metadata, clipped mockups, contrast
below WCAG AA, tap targets under 32 px, hidden animated content, a pinned story
that does not pin, or a broken internal link. They need `CHROME_PATH` only if
Chrome is not at the default Windows location.

---

## Environment variables

Copy `.env.example` to `.env.local`. Nothing here is a backend secret — this site
never talks to the Spring Boot services directly.

| Variable                          | Purpose                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | Production origin. Drives canonicals, sitemap, robots and OG image URLs |
| `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL`| Play Store listing (empty → waitlist state on `/download`)              |
| `NEXT_PUBLIC_IOS_DOWNLOAD_URL`    | App Store listing (empty → waitlist state on `/download`)               |
| `NEXT_PUBLIC_SUPPORT_EMAIL`       | Support inbox used in footer, FAQ, download and legal pages             |
| `NEXT_PUBLIC_ANALYTICS_ID`        | gtag-compatible measurement id. **Analytics is completely off while empty** |

While `NEXT_PUBLIC_SITE_URL` is unset the site falls back to
`https://dispense.example` and `npm run verify` tells you so — it is a placeholder
so builds never break, not a domain to launch on.

---

## Where things live

```
app/
  layout.tsx              root shell: fonts, metadata, navbar, footer, JSON-LD
  page.tsx                homepage (the full visual story)
  features|how-it-works|download|faq|security|privacy|terms|blog   routes
  blog/[slug]/            markdown-backed posts (closed until content exists)
  not-found.tsx, error.tsx, global-error.tsx    error and empty states
  sitemap.ts, robots.ts, manifest.ts            crawler + PWA files
  globals.css             design tokens, typography scale, components layer
components/
  marketing/              every section, frame, mockup and CTA
    app-ui/               the product UI drawn inside phone mockups
  consent/                banner, preferences dialog, consent context
  seo/                    JsonLd, Breadcrumbs
  analytics/              runtime that connects consent to the analytics module
lib/
  site-config.ts          brand, URLs, social, download, analytics (one source)
  seo.ts                  metadata builder + JSON-LD builders
  content/                navigation, product copy, FAQ (single source of truth)
  demo-data.ts            the illustrative dataset behind every figure
  site-assets.ts          build-time detection of supplied assets
  blog.ts                 markdown content layer
  consent.ts              consent record, categories, state machine, storage
  analytics.ts            provider-agnostic event API, consent gating, engagement
scripts/                  audit and asset-generation harness (see docs/qa.md)
e2e/                      Playwright specs, six browser projects
```

### Consent and analytics

Nothing optional is stored or measured before a visitor decides. The pieces:

- `lib/consent.ts` — categories (necessary / analytics / marketing), a versioned
  record (`CONSENT_VERSION`), storage wrapped so a blocked `localStorage` degrades
  to an in-memory decision, and a subscription used by `useSyncExternalStore`.
- `components/consent/` — the banner, the preference centre (modal with focus trap,
  Escape, focus restoration) and the footer control to reopen it.
- `lib/analytics.ts` — vendor-agnostic `pageView`, `trackEvent`, `identify`,
  `consentUpdated`. Nothing leaves the browser unless analytics consent is granted
  *and* a measurement id is configured. Engagement is counted from visible time
  only, reported every 15 seconds and on tab hide — never as attention.
- `components/analytics/AnalyticsProvider.tsx` — wires the two together, emits
  route-change page views and delegates `data-analytics` clicks so sections stay
  server components.

Adding a provider means implementing one adapter object in `lib/analytics.ts`.
No component changes, and no component ever talks to a vendor directly.

### Security headers

`next.config.ts` sets a CSP (production only — the dev overlay needs
`unsafe-eval`), `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`,
`Permissions-Policy`, `X-Content-Type-Options` and COOP. External origins the
policy allows, and why:

| Origin | Used for |
| --- | --- |
| `www.googletagmanager.com` | Analytics script, only after consent |
| `www.google-analytics.com`, `*.analytics.google.com` | Analytics beacons, only after consent |
| `www.youtube-nocookie.com`, `player.vimeo.com` | Optional video embed (`NEXT_PUBLIC_DEMO_EMBED_URL`) |

`script-src` includes `'unsafe-inline'` for the pre-paint motion boot script.
Moving to nonces would force every route to render dynamically, trading SEO and
performance for a marginal gain, so the inline script is kept deliberately small
and documented in the config.

### Content and figures

Every amount, percentage and date in the mockups and diagrams is **derived** from
`lib/demo-data.ts` (and, for dates, from the current date). Nothing is typed into
copy by hand: change an allocation there and the wallet screen, the money-flow
animation, the feature visuals and the editorial diagram all follow.

Product copy lives in `lib/content/*` so the homepage, `/features` and
`/how-it-works` cannot drift apart.

### Motion

GSAP + ScrollTrigger, always through `useGSAP` with a scoped `gsap.matchMedia()`:

- `components/marketing/Reveal.tsx` — the single reveal primitive
- `MoneyFlow.tsx` — scrubbed "one balance becomes sub-wallets" sequence
- `ProductStory.tsx` — pinned six-stage product story (desktop), stacked narrative (mobile)
- `HeroVisual.tsx` — the hero device sequence
- `StepSequence.tsx` — the how-it-works narrative

Conventions that matter:

- Animated elements are pre-hidden only through `[data-motion]`, which the boot
  script in `app/layout.tsx` activates **only** when `prefers-reduced-motion` is
  not set, and clears after 2.5 s as a safety net if the motion layer never runs.
- Never use `gsap.from()` on a `[data-motion]` element — its computed value is
  already `0`. Use `fromTo()` with an explicit end state (`Reveal.tsx` does this,
  and hands `data-motion` over to GSAP in the same tick).
- ScrollTriggers and matchMedia contexts are created client-side only and reverted
  on unmount, so client-side route changes never leak triggers.

Reduced motion keeps every word and image, drops the scrubbed/pinned sequences,
and leaves short, readable transitions.

---

## Replacing the placeholders

The site ships complete without any supplied asset. To add real ones, see
`public/images/README.md` — in short:

- Logo — **already wired in**: the supplied `public/dispense-word-logo.png` was
  trimmed and exported to `public/images/marketing/dispense-logo.png`, and the
  navbar, footer, mobile menu, QR panel and OG cards all use it. Drop a `.svg`
  lockup at the same path to switch to vector.
- Square brand mark → `public/images/marketing/dispense-mark.svg` (used for small
  spaces; the generated `app/icon.svg` + `app/apple-icon.png` cover favicons).
- Screenshots → `public/images/app/{home,wallet,sub-wallet,payout,activity}.png`
- Video → `public/media/dispense-demo.mp4` (+ optional `-poster.jpg`)
- Social cards → `npm run og:generate` (it embeds the real lockup automatically)

Each is picked up automatically: `npm run assets:sync` probes `public/` and rewrites
`lib/asset-manifest.json`, and it runs as a `predev`/`prebuild` step. That manifest
is what the app imports, so asset state is a real build input — dropping a file in
can never be masked by a cached render.

---

## SEO

- Unique title, description, canonical, Open Graph and Twitter card per route via
  `lib/seo.ts` → `pageMetadata()`.
- JSON-LD: `Organization` + `WebSite` site-wide, `SoftwareApplication`,
  `FAQPage` (on `/` and `/faq`), `BreadcrumbList` on subroutes, `BlogPosting` once
  posts exist.
- `sitemap.xml` (static routes + blog posts), `robots.txt` with a sitemap
  reference, PWA manifest, generated OG cards.
- No fabricated credibility anywhere: no ratings, review counts, download counts,
  user numbers, testimonials, partner logos or certifications. Missing facts are
  stated as placeholders instead.

## Accessibility

Skip link, semantic landmarks and heading order, labelled interactive controls,
visible `:focus-visible` rings, keyboard-operable accordion and mobile navigation,
`prefers-reduced-motion` support, alt text on every meaningful image, and no
meaning carried by animation alone.

---

## Deployment

Static-friendly: every route prerenders. Deploy to any Node host (Vercel, Fly,
Render, a container) with `npm ci && npm run build && npm start`, and set the
environment variables above in the host's dashboard.

Before going live:

1. Set `NEXT_PUBLIC_SITE_URL` to the real origin, then re-run `npm run og:generate`.
2. Set the support inbox (and the store URLs once the listings exist).
3. Replace the logo, screenshots and video.
4. Rotate nothing — no secrets are used by this site — but confirm
   `NEXT_PUBLIC_ANALYTICS_ID` is either empty or a real measurement id.
