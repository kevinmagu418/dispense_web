# Assets

Everything in this folder is a placeholder slot. Dropping a real file in with the
expected name switches the page over to it on the next build — no code changes,
no component edits, no re-wiring.

## Logo and brand mark

| File                                        | Used for                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| `public/images/marketing/dispense-logo.svg` | Full lockup — navbar, footer, mobile menu             |
| `public/images/marketing/dispense-logo.png` | Same, if you only have a raster export                |
| `public/images/marketing/dispense-mark.svg` | Square mark only — favicons, small spaces             |

**Current state:** the supplied lockup (`public/dispense-word-logo.png`) is wired
in. It was trimmed of transparent padding and exported to
`public/images/marketing/dispense-logo.png` (640 × 454, aspect 1.409), which the
navbar, footer, mobile menu, QR panel and generated OG cards all render. The
component reads the file's intrinsic dimensions, so replacing it with a vector
lockup — or a differently proportioned one — needs no code change.

If no logo file exists, the site falls back to a geometric placeholder mark
(three stacked bars in brand blue) from `components/marketing/Logo.tsx`, so a
blank is never rendered.

Rendered sizes: **32 px** tall in the navbar, **38 px** in the footer, **26 px**
in compact contexts. A vector export is still preferred for future-proofing.

The favicon and PWA icons live outside this folder:

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `app/icon.svg`         | Browser favicon (vector)                   |
| `app/apple-icon.png`   | iOS home-screen icon, 180 × 180            |
| `public/icon.svg`      | Manifest icon reference                    |
| `public/icons/*`       | Additional sizes if you generate them      |

Replace all four together when the real logo arrives.

## App screenshots

| File                            | Shown as            |
| ------------------------------- | ------------------- |
| `public/images/app/home.png`    | Home                |
| `public/images/app/wallet.png`  | Wallet              |
| `public/images/app/sub-wallet.png` | Sub-wallet       |
| `public/images/app/payout.png`  | Payout              |
| `public/images/app/activity.png`| Activity            |

Notes:

- Capture at the phone's native resolution (e.g. 1080 × 2340) — the frame crops
  with `object-cover` into a 300 × 640 screen area, so **keep the status bar and
  bottom edge in the capture** rather than cropping them yourself.
- `.webp` is accepted for any of the five names.
- The section on the homepage and the features page detect these files at build
  time (`lib/site-assets.ts`). Add one and only that device switches over; the
  rest keep using the live product UI. A caption under the showcase changes
  automatically once at least one real capture is present.
- Dark screenshots are not supported by the current frame styling — send light
  mode captures.

## Video

| File                                  | Used for                        |
| ------------------------------------- | ------------------------------- |
| `public/media/dispense-demo.mp4`      | The "See Dispense in action" player |
| `public/media/dispense-demo-poster.jpg` | Poster frame shown before play |

Until `dispense-demo.mp4` exists the section renders a composed "coming soon"
state instead of an empty player. Compression target: H.264, 1080p, ~5–8 Mbps,
30–60 seconds, under ~10 MB.

## Open Graph / social cards

`public/images/og/*.png` are generated, not hand-designed:

```bash
npm run og:generate
```

That renders each card in a real browser from the same design tokens and writes
1200 × 630 PNGs. Re-run it after changing `NEXT_PUBLIC_SITE_URL` (the domain
printed on the card comes from that variable) or after replacing the logo.

## Other folders

- `public/images/devices/` — reserved for higher-fidelity device renders.
- `public/images/illustrations/` — reserved for editorial artwork.
- `public/icons/` — generated PWA icon sizes.
