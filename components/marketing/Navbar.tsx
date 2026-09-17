"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { primaryNav } from "@/lib/content/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { CTAButton } from "./CTAButton";

/**
 * Sticky navigation.
 *
 * Minimal and transparent over the hero, then a frosted surface with a hairline
 * once the page scrolls. The logo is injected from the server layout so this
 * component stays free of server-only imports.
 *
 * Mobile panel behaviour, deliberately:
 *   · focus moves into the panel when it opens and returns to the toggle when it
 *     closes, with Tab looping inside while it is open
 *   · Escape closes it, a link click closes it, and resizing to desktop closes it
 *   · background scroll is locked while it is open
 *   · `data-nav="open"` on <html> lets the consent banner step aside instead of
 *     stacking on top of it
 */
export function Navbar({ logo }: { logo: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Panel lifecycle: focus handling, scroll lock, Escape, and an automatic close
     when the layout switches back to the desktop navigation. */
  useEffect(() => {
    const root = document.documentElement;

    if (!open) {
      delete root.dataset.nav;
      return;
    }

    root.dataset.nav = "open";
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")) : [];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = previousOverflow;
      delete root.dataset.nav;
    };
  }, [open]);

  const closePanel = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  const activePath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open
          ? "surface-blur border-b border-line shadow-[0_10px_30px_-24px_rgba(10,16,32,0.5)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="pt-safe px-safe">
        <div className="container-x flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="flex items-center rounded-[10px] py-2"
          >
            {logo}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {primaryNav.map((item) => {
              const active = activePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-[10px] px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                    active ? "text-ink" : "text-subtle hover:text-ink",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3.5 bottom-1 h-[2px] rounded-full bg-brand transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <CTAButton href="/download" size="sm" event="navbar_download_click">
              Get Dispense
            </CTAButton>
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="flex size-11 items-center justify-center rounded-[12px] border border-line bg-white/80 text-ink transition-colors hover:bg-white lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-[10px] w-[18px]">
              <span
                className={cn(
                  "absolute left-0 h-[1.8px] w-full rounded-full bg-ink transition-transform duration-300",
                  open ? "top-[4px] rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-[1.8px] w-full rounded-full bg-ink transition-transform duration-300",
                  open ? "top-[4px] -rotate-45" : "top-[8px]",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="mobile-navigation"
        className={cn(
          "overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          open ? "max-h-[32rem] opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-3">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={closePanel}
              className="flex flex-col gap-1 rounded-[12px] px-3 py-3.5 transition-colors hover:bg-canvas"
            >
              <span className="text-[1.0625rem] font-semibold text-ink">{item.label}</span>
              {item.description ? (
                <span className="text-[0.8125rem] leading-snug text-subtle">{item.description}</span>
              ) : null}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 px-1 pb-2">
            <CTAButton href="/download" event="navbar_download_click" tabIndex={open ? 0 : -1}>
              Get Dispense
            </CTAButton>
            <p className="t-small text-center text-faint">
              {siteConfig.download.socialProofPlaceholder}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
