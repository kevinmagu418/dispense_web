import type { NextConfig } from "next";

import { siteConfig } from "./lib/site-config";

/**
 * Security headers.
 *
 * The Content Security Policy is only applied in production: Next's dev overlay
 * needs `unsafe-eval`, so shipping the same policy in development would either
 * break the overlay or force a weaker production policy.
 *
 * The policy is deliberately narrow but honest about what the site can load:
 *   · scripts — self, plus the analytics origin only (loaded after consent)
 *   · styles  — self plus inline, because Next inlines critical CSS and the
 *               design system uses inline style attributes for dynamic values
 *   · images  — self, data URIs (inline SVG placeholders) and the analytics
 *               pixel endpoint
 *   · frames  — the video embed origins only, listed in lib/site-config.ts
 *   · objects, framing, base tags — locked down
 *
 * `unsafe-inline` on script-src is required by the pre-paint motion/consent boot
 * script. Moving to nonces would force dynamic rendering of every route, which
 * would trade a large SEO and performance loss for a marginal gain — so the
 * inline script is kept to a documented, auditable minimum instead.
 */
const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  `frame-src ${["'self'", ...siteConfig.assets.embedOrigins].join(" ")}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProduction
    ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 420, 640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [180, 236, 268, 320, 420],
  },
  async headers() {
    return [
      {
        /* Apply to every route; the policy is static and needs no per-page logic. */
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        /* Immutable content-hashed assets. */
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
