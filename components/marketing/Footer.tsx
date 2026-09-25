import Link from "next/link";

import { footerNav, legalNav } from "@/lib/content/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { ConsentPreferencesButton } from "@/components/consent/ConsentPreferencesButton";

import { CTAButton } from "./CTAButton";
import { DispenseLogo } from "./Logo";

/** Resolves the portable `mailto:support` placeholder to the configured inbox. */
function resolveHref(href: string): string {
  if (href === "mailto:support") return `mailto:${siteConfig.supportEmail}`;
  return href;
}

function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function Footer() {
  const year = new Date().getFullYear();
  const socialEntries = Object.entries(siteConfig.social).filter(([, url]) => url.length > 0);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label={`${siteConfig.name} — home`} className="w-fit">
              <DispenseLogo size="md" />
            </Link>
            <p className="t-small max-w-[34ch]">
              Dispense keeps your everyday balance in one place and separates it into sub-wallets for
              rent, transport, groceries, savings and more. Your money has a purpose before it
              leaves.
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <CTAButton href="/download" event="footer_download_click" size="sm" className="w-fit">
                Download Dispense
              </CTAButton>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="t-small link-tap link-underline w-fit text-subtle"
              >
                {siteConfig.supportEmail}
              </a>
            </div>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3.5">
              <h2 className="t-eyebrow text-faint">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => {
                  const href = resolveHref(item.href);
                  return (
                    <li key={`${column.title}-${item.label}`}>
                      {isExternal(href) ? (
                        <a
                          href={href}
                          className="link-tap text-[0.9375rem] text-subtle transition-colors hover:text-brand-dark"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="link-tap text-[0.9375rem] text-subtle transition-colors hover:text-brand-dark"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line-soft pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="t-small text-faint">
              © {year} {siteConfig.name}. All rights reserved.
            </span>
            <span aria-hidden="true" className="hidden size-1 rounded-full bg-line lg:block" />
            <span className="t-small text-faint">{siteConfig.legalEntityPlaceholder}</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li>
                <ConsentPreferencesButton />
              </li>
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-small link-tap text-subtle transition-colors hover:text-brand-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {socialEntries.length > 0 ? (
              <ul className="flex items-center gap-4">
                {socialEntries.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "t-small link-tap capitalize text-subtle transition-colors hover:text-brand-dark",
                      )}
                    >
                      {key}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t-small text-faint">
                Social profiles will be listed here once they are published.
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
