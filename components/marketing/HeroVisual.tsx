"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { demoProduct } from "@/lib/demo-data";
import { motion as motionTokens } from "@/lib/constants";
import { formatKes } from "@/lib/utils";

import { PhoneMockup } from "./PhoneMockup";
import { WalletScreen } from "./app-ui/screens";
import { CalendarIcon, BusIcon } from "./app-ui/icons";

/**
 * The hero product presentation.
 *
 * Sequence (desktop and mobile alike): the device rises into place, the wallet
 * balance reveals, sub-wallet rows stagger in, activity lands, then the two
 * annotation chips settle around the device. Everything is transform/opacity
 * only, runs once, and is skipped entirely under prefers-reduced-motion.
 */
export function HeroVisual() {
  const scope = useRef<HTMLDivElement | null>(null);
  const busWallet = demoProduct.subWallets[1];
  const transportLeft = busWallet.allocated - busWallet.paid;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current;
        if (!root) return;

        const timeline = gsap.timeline({
          defaults: { ease: motionTokens.ease },
          delay: 0.1,
        });

        timeline
          .fromTo(
            root.querySelectorAll("[data-hero-frame]"),
            { opacity: 0, y: 46, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 1.05 },
            0,
          )
          .from(
            root.querySelectorAll("[data-screen-part='card']"),
            { y: 16, opacity: 0, duration: 0.6 },
            0.34,
          )
          .fromTo(
            root.querySelectorAll("[data-screen-part='balance']"),
            { yPercent: 118 },
            { yPercent: 0, duration: 0.7 },
            0.44,
          )
          .from(
            root.querySelectorAll("[data-screen-part='subwallet']"),
            { y: 16, opacity: 0, duration: 0.55, stagger: 0.075 },
            0.6,
          )
          .from(
            root.querySelectorAll("[data-screen-part='activity']"),
            { y: 14, opacity: 0, duration: 0.5, stagger: 0.085 },
            0.84,
          )
          .from(
            root.querySelectorAll("[data-hero-chip]"),
            { y: 14, opacity: 0, duration: 0.55, stagger: 0.1 },
            0.72,
          );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(scope.current, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative mx-auto w-fit">
      <div data-hero-frame data-motion="" className="relative">
        {/* Two renderings rather than one squeezed device: at 320px the phone is
            sized to the gutter so nothing is clipped, and from 640px up it uses
            the full presentation size. */}
        <div className="sm:hidden">
          <PhoneMockup width={268} glow>
            <WalletScreen />
          </PhoneMockup>
        </div>
        <div className="hidden sm:block">
          <PhoneMockup width={318} glow>
            <WalletScreen />
          </PhoneMockup>
        </div>

        {/* Annotation chips — product facts, so they stay visible on mobile too. */}
        <div
          data-hero-chip
          className="absolute -left-6 top-[104px] hidden w-[200px] rounded-[14px] border border-line surface-blur p-3 shadow-[0_18px_40px_-28px_rgba(10,16,32,0.45)] sm:block lg:-left-24"
        >
          <span className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-[9px] bg-brand-tint">
              <CalendarIcon width={14} height={14} className="text-brand" />
            </span>
            <span className="text-[0.8125rem] font-semibold text-ink">Rent scheduled</span>
          </span>
          <p className="mt-2 text-[0.8125rem] font-semibold tabular-nums text-ink">
            {formatKes(demoProduct.subWallets[0].allocated)}
          </p>
          <p className="text-[0.75rem] text-faint">
            {demoProduct.subWallets[0].scheduleLabel} · {demoProduct.subWallets[0].payoutHour}
          </p>
        </div>

        <div
          data-hero-chip
          className="absolute -right-6 bottom-[124px] hidden w-[188px] rounded-[14px] border border-line surface-blur p-3 shadow-[0_18px_40px_-28px_rgba(10,16,32,0.45)] sm:block lg:-right-24"
        >
          <span className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-[9px] bg-[#e8f7ee]">
              <BusIcon width={14} height={14} className="text-cat-transport" />
            </span>
            <span className="text-[0.8125rem] font-semibold text-ink">Transport</span>
          </span>
          <p className="mt-2 text-[0.8125rem] font-semibold tabular-nums text-ink">
            {formatKes(transportLeft)} left
          </p>
          <p className="text-[0.75rem] text-faint">
            {formatKes(busWallet.allocated)} allocated this week
          </p>
        </div>
      </div>
    </div>
  );
}
