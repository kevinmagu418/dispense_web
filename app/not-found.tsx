import type { Metadata } from "next";

import { CTAButton } from "@/components/marketing/CTAButton";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Page not found — Dispense",
  description: "The page you were looking for does not exist on this site.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 lg:pt-48 lg:pb-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[460px] glow-brand" />
      <div className="container-x relative">
        <div className="max-w-[40rem]">
          <span className="pill pill-brand">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            404
          </span>
          <h1 className="t-h1 mt-6">This page has not been set up.</h1>
          <p className="t-lead mt-5">
            The link you followed does not point to anything on this site. Nothing is broken on your
            side — the address is either out of date or mistyped.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/">Back to the homepage</CTAButton>
            <CTAButton href="/download" variant="secondary">
              Go to the download page
            </CTAButton>
          </div>

          <div className="mt-14">
            <p className="t-eyebrow text-faint">Popular pages</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {[
                { label: "Features", href: "/features" },
                { label: "How it works", href: "/how-it-works" },
                { label: "Security", href: "/security" },
                { label: "FAQ", href: "/faq" },
                { label: "Blog", href: "/blog" },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="t-small link-tap link-underline font-semibold">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
