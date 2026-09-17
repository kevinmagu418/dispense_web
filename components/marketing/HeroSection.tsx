import Link from "next/link";

import { sectionIds } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

import { CTAButton } from "./CTAButton";
import { HeroVisual } from "./HeroVisual";

/**
 * Hero: a product-centred statement rather than a welcome banner, paired with
 * the animated device. All copy is server-rendered so the headline, sub-copy
 * and calls to action exist in the HTML for crawlers.
 */
export function HeroSection() {
  return (
    <section id={sectionIds.hero} className="relative overflow-hidden pb-4 pt-28 sm:pt-32 lg:pb-16 lg:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] glow-brand"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] grid-atmosphere"
        style={{
          maskImage: "radial-gradient(72% 68% at 50% 0%, #000 0%, transparent 76%)",
          WebkitMaskImage: "radial-gradient(72% 68% at 50% 0%, #000 0%, transparent 76%)",
        }}
      />

      <div className="container-x relative">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-10">
          <div className="max-w-[38rem]">
            <span className="pill pill-brand">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              Personal finance, made clearer.
            </span>

            <h1 className="t-display mt-6">
              Your money,{" "}
              <span className="relative inline-block">
                <span className="text-brand">organized</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-brand/25"
                />
              </span>{" "}
              around your life.
            </h1>

            <p className="t-lead mt-7 max-w-[46ch]">
              Dispense holds the money you live on in one place, then separates it into the things it
              is actually for — rent, transport, groceries, savings. You always know what is
              available, and what is already spoken for.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton href="/download" event="hero_download_click">
                Download Dispense
              </CTAButton>
              <CTAButton href="/how-it-works" variant="secondary" event="hero_how_it_works_click">
                See how it works
              </CTAButton>
            </div>

            <p className="t-small mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-faint">
              <span>{siteConfig.download.socialProofPlaceholder}</span>
              <Link href="/download" className="link-tap link-underline text-subtle">
                Join the waitlist
              </Link>
            </p>
          </div>

          <div className="relative lg:pl-4">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
