import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { PreferencesDialog } from "@/components/consent/PreferencesDialog";
import { Footer } from "@/components/marketing/Footer";
import { DispenseLogo } from "@/components/marketing/Logo";
import { Navbar } from "@/components/marketing/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

/**
 * Manrope is self-hosted so the build has no runtime font dependency and the
 * typography matches the Dispense mobile app exactly. `display: swap` plus the
 * matched fallback stack keeps first paint immediate without a large reflow.
 */
const manrope = localFont({
  src: [{ path: "../assets/fonts/Manrope-Variable.ttf", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Dispense — Organize Your Money Around Your Life",
    template: "%s",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "personal finance app",
    "money management app",
    "budgeting app Kenya",
    "sub-wallets",
    "digital wallet",
    "organize expenses",
    "rent and transport savings",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Dispense — Organize Your Money Around Your Life",
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.og.defaultImage,
        width: siteConfig.og.width,
        height: siteConfig.og.height,
        alt: "Dispense — your money, organized around your life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dispense — Organize Your Money Around Your Life",
    description: siteConfig.description,
    images: [siteConfig.og.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "finance",
};

export const viewport: Viewport = {
  themeColor: "#f6f7fb",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint: enables the pre-hide rule that keeps animated
 * elements from flashing their finished state, but only when motion is welcome.
 * The timer is a safety net — if the animation layer never boots, content is
 * revealed rather than lost. Feature-detected throughout and wrapped in try/catch
 * so a blocked API cannot break the page.
 */
const motionBootScript = `(function(){try{var r=document.documentElement;if(!window.matchMedia||!r.classList)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.classList.add('js-motion');setTimeout(function(){r.classList.remove('js-motion');},2500);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* suppressHydrationWarning: the boot script below adds a class to <html>
       before React hydrates, which is the documented case for this escape hatch.
       It applies to this element's attributes only, not to the tree beneath it. */
    <html
      lang={siteConfig.language}
      className={`${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        {/* Without JavaScript the page must still be navigable and readable: the
            accordion panels open and the mobile menu shows its links, so no copy
            is trapped behind an interaction that cannot run. */}
        <noscript>
          <style>{`
            .faq-panel { grid-template-rows: 1fr !important; }
            #mobile-navigation { max-height: none !important; opacity: 1 !important; pointer-events: auto !important; }
            .consent-banner { display: none !important; }
          `}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-body">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* Consent wraps everything that could measure anything. */}
        <ConsentProvider>
          <Navbar logo={<DispenseLogo />} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />

          <AnalyticsProvider measurementId={siteConfig.analytics.id} />
          <CookieBanner />
          <PreferencesDialog />
        </ConsentProvider>

        <JsonLd id="dispense-organization" json={graph(organizationSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
