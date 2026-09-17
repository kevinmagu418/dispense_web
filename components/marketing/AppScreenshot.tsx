"use client";

import Image from "next/image";
import { useState } from "react";

import { PhoneMockup } from "./PhoneMockup";
import { screenFor } from "./app-ui/screens";

/**
 * One device in the screenshot showcase.
 *
 * If a real screenshot exists at /public/images/app/<key>.png the page renders
 * it automatically; otherwise the same screen is drawn live from the product UI
 * components. Either way the layout, frame and proportions are identical, so
 * dropping the files in is the only step required to switch to real captures.
 */

export type AppScreenshotProps = {
  screen: "home" | "wallet" | "sub-wallet" | "payout" | "activity";
  src: string | null;
  label: string;
  caption?: string;
  width?: number;
  priority?: boolean;
};

export function AppScreenshot({
  screen,
  src,
  label,
  caption,
  width = 268,
  priority = false,
}: AppScreenshotProps) {
  const [failed, setFailed] = useState(false);
  const useImage = Boolean(src) && !failed;

  return (
    <figure className="flex flex-col items-center">
      <PhoneMockup width={width}>
        {useImage && src ? (
          <Image
            src={src}
            alt={`Dispense ${label} screen`}
            width={300}
            height={640}
            priority={priority}
            sizes={`${width}px`}
            className="h-[640px] w-[300px] object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          screenFor(
            screen === "sub-wallet" ? "rent" : screen === "payout" ? "payout" : screen,
          )
        )}
      </PhoneMockup>
      <figcaption className="mt-5 text-center">
        <span className="block text-[0.9375rem] font-semibold text-ink">{label}</span>
        {caption ? <span className="mt-1 block text-sm text-subtle">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}
