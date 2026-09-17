import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Premium device frame built entirely in CSS so it stays sharp at any size and
 * never ships a bitmap. Content is authored at the frame's native 320 × 660
 * design size and scaled to the requested width — mockup proportions therefore
 * stay identical between the hero, the story sequence and small previews.
 */

const DESIGN_WIDTH = 320;
const DESIGN_HEIGHT = 660;
const BEZEL = 10;

export type PhoneMockupProps = {
  children: ReactNode;
  /** Rendered width in CSS pixels. Height follows the frame ratio. */
  width?: number;
  className?: string;
  /** Adds the soft brand glow behind the device. */
  glow?: boolean;
  /** Hide the frame chrome when a section supplies its own. */
  decorative?: boolean;
};

export function PhoneMockup({
  children,
  width = DESIGN_WIDTH,
  className,
  glow = false,
  decorative = true,
}: PhoneMockupProps) {
  const scale = width / DESIGN_WIDTH;
  const height = Math.round(DESIGN_HEIGHT * scale);

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[6%] h-[78%] w-[150%] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(21,101,255,0.28), transparent 68%)" }}
        />
      ) : null}

      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
        }}
        {...(decorative ? { "aria-hidden": true } : {})}
      >
        {/* Body */}
        <div
          className="absolute inset-0 rounded-[46px]"
          style={{
            background: "linear-gradient(158deg, #303a4d 0%, #171e2d 46%, #0c1120 100%)",
            boxShadow:
              "0 44px 90px -46px rgba(10,16,32,0.55), 0 12px 28px -18px rgba(10,16,32,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
        {/* Inner bezel highlight */}
        <div className="absolute inset-[3px] rounded-[43px] border border-white/[0.07]" />

        {/* Side controls */}
        <span className="absolute left-[-2px] top-[132px] h-[30px] w-[3px] rounded-l-[3px] bg-[#2c3648]" />
        <span className="absolute left-[-2px] top-[176px] h-[52px] w-[3px] rounded-l-[3px] bg-[#2c3648]" />
        <span className="absolute left-[-2px] top-[240px] h-[52px] w-[3px] rounded-l-[3px] bg-[#2c3648]" />
        <span className="absolute right-[-2px] top-[186px] h-[74px] w-[3px] rounded-r-[3px] bg-[#2c3648]" />

        {/* Screen */}
        <div
          className="absolute overflow-hidden rounded-[37px] bg-white"
          style={{ left: BEZEL, top: BEZEL, width: 300, height: 640 }}
        >
          {children}
          {/* Dynamic island */}
          <span className="absolute left-1/2 top-[6px] h-[21px] w-[84px] -translate-x-1/2 rounded-full bg-[#080d18]" />
          {/* Glass sheen — deliberately faint so text stays readable */}
          <span
            className="pointer-events-none absolute inset-0 rounded-[37px]"
            style={{
              background:
                "linear-gradient(122deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 26%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.05) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const PHONE_DESIGN = { width: DESIGN_WIDTH, height: DESIGN_HEIGHT } as const;
