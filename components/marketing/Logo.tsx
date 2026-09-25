import Image from "next/image";

import { getAppAssets } from "@/lib/site-assets";

import { LogoMark } from "./LogoMark";
import { cn } from "@/lib/utils";

/**
 * The single place the Dispense logo is rendered.
 *
 * A real lockup is supplied at `public/dispense-word-logo.png` (trimmed copy in
 * `public/images/marketing/dispense-logo.png`), so every usage — navbar, footer,
 * mobile panel, OG cards — renders the brand asset at its true aspect ratio.
 *
 * Replacing it later needs no code change: drop a file at
 *   public/images/marketing/dispense-logo.svg   (any lockup, preferred)
 * or public/images/marketing/dispense-logo.png
 * and the component picks it up, along with its intrinsic dimensions.
 *
 * When no logo file exists the component falls back to a geometric placeholder
 * mark in the brand's own visual language, so the site never renders a blank.
 */

export type DispenseLogoProps = {
  /** `light` = for light backgrounds, `dark` = white lockup for dark sections. */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { height: 26, mark: 26, text: "text-[1.0625rem]" },
  md: { height: 36, mark: 34, text: "text-[1.25rem]" },
  lg: { height: 42, mark: 42, text: "text-[1.625rem]" },
} as const;

export function DispenseLogo({
  variant = "light",
  size = "md",
  showWordmark = true,
  className,
  priority = false,
}: DispenseLogoProps) {
  const assets = getAppAssets();
  const dims = sizes[size];
  const isDark = variant === "dark";

  if (assets.logo) {
    /* Vector lockups are rendered as-is: next/image cannot optimise SVG, and the
       browser resolves their intrinsic aspect ratio from the file itself. */
    if (assets.logo.endsWith(".svg")) {
      return (
        <span className={cn("inline-flex items-center", className)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assets.logo}
            alt="Dispense"
            height={dims.height}
            style={{ height: dims.height, width: "auto" }}
            {...(isDark ? { className: "brightness-0 invert" } : {})}
          />
        </span>
      );
    }

    return (
      <span className={cn("inline-flex items-center", className)}>
        <Image
          src={assets.logo}
          alt="Dispense"
          width={Math.round(dims.height * assets.logoAspect)}
          height={dims.height}
          priority={priority}
          sizes={`${Math.round(dims.height * assets.logoAspect * 2)}px`}
          className="w-auto"
          style={{ height: dims.height }}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-[0.55rem]", className)}>
      {assets.mark ? (
        <Image
          src={assets.mark}
          alt=""
          width={dims.mark}
          height={dims.mark}
          priority={priority}
          unoptimized={assets.mark.endsWith(".svg")}
        />
      ) : (
        <LogoMark size={dims.mark} variant={variant} />
      )}
      {showWordmark ? (
        <span
          className={cn(
            "font-bold tracking-[-0.035em]",
            dims.text,
            isDark ? "text-white" : "text-ink",
          )}
        >
          Dispense
        </span>
      ) : null}
    </span>
  );
}

export { LogoMark };
