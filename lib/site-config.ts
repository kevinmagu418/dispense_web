/**
 * Single source of truth for brand, URLs and outbound configuration.
 * Nothing here should be duplicated elsewhere in the codebase.
 *
 * Values that are not yet known (store links, social handles, support inbox)
 * fall back to clearly marked placeholders — replace them through environment
 * variables (see .env.example) or directly here.
 */

const FALLBACK_SITE_URL = "https://dispense.example";

function readEnv(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Absolute site origin, used for canonicals, sitemap, robots and OG images. */
export const siteUrl = (readEnv(process.env.NEXT_PUBLIC_SITE_URL) || FALLBACK_SITE_URL).replace(
  /\/+$/,
  "",
);

/** True when the deployment has not been given a real origin yet. */
export const usingPlaceholderSiteUrl = siteUrl === FALLBACK_SITE_URL;

const androidDownloadUrl = readEnv(process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL);
const iosDownloadUrl = readEnv(process.env.NEXT_PUBLIC_IOS_DOWNLOAD_URL);
const supportEmail = readEnv(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) || "support@dispense.example";
const analyticsId = readEnv(process.env.NEXT_PUBLIC_ANALYTICS_ID);
/* Optional hosted player (YouTube/Vimeo/…). Empty means the native HTML5 video
   path is used when a file is supplied, otherwise the coming-soon state. */
const demoEmbedUrl = readEnv(process.env.NEXT_PUBLIC_DEMO_EMBED_URL);

export const siteConfig = {
  name: "Dispense",
  shortName: "Dispense",
  /** Used in <title> defaults, JSON-LD and the footer. */
  tagline: "Your money, organized around your life.",
  description:
    "Dispense is a personal money app that keeps your everyday balance in one place and separates it into sub-wallets for rent, transport, groceries, savings and more — so you always know what is available and what is already spoken for.",
  url: siteUrl,
  usingPlaceholderSiteUrl,
  locale: "en_KE",
  language: "en",
  region: "Kenya",
  supportEmail,
  /** Legal entity details are added by the brand team before launch. */
  legalEntityPlaceholder: "Dispense (legal entity details to be added)",
  addressPlaceholder: "Registered address to be added",
  social: {
    /* Add real profile URLs once the accounts are published. */
    x: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
  },
  download: {
    /* Store listings do not exist yet — never invent them. */
    androidUrl: androidDownloadUrl,
    iosUrl: iosDownloadUrl,
    hasAndroid: androidDownloadUrl.length > 0,
    hasIos: iosDownloadUrl.length > 0,
    socialProofPlaceholder: "App store availability will be added here.",
  },
  analytics: {
    id: analyticsId,
    enabled: analyticsId.length > 0,
  },
  og: {
    width: 1200,
    height: 630,
    defaultImage: "/images/og/og-home.png",
    images: {
      "/": "/images/og/og-home.png",
      "/features": "/images/og/og-features.png",
      "/how-it-works": "/images/og/og-how-it-works.png",
      "/download": "/images/og/og-download.png",
      "/faq": "/images/og/og-faq.png",
      "/security": "/images/og/og-security.png",
      "/privacy": "/images/og/og-privacy.png",
      "/terms": "/images/og/og-terms.png",
      "/blog": "/images/og/og-blog.png",
    },
  },
  assets: {
    appScreenshotDir: "/images/app",
    marketingDir: "/images/marketing",
    mediaDir: "/media",
    demoVideo: "/media/dispense-demo.mp4",
    demoVideoPoster: "/media/dispense-demo-poster.jpg",
    /** Third-party origins that must be allowed by the CSP when embeds are used. */
    embedOrigins: ["https://www.youtube-nocookie.com", "https://player.vimeo.com"],
    demoEmbedUrl,
  },
} as const;

export type SiteConfig = typeof siteConfig;
