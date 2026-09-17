import { getAppAssets, type AppScreenKey } from "@/lib/site-assets";

import { AppScreenshot } from "./AppScreenshot";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const screens: Array<{
  key: AppScreenKey;
  label: string;
  caption: string;
  analyticsScreen: "home" | "wallet" | "sub-wallet" | "payout" | "activity";
}> = [
  { key: "home", label: "Home", caption: "The day at a glance.", analyticsScreen: "home" },
  {
    key: "wallet",
    label: "Wallet",
    caption: "One balance, clearly stated.",
    analyticsScreen: "wallet",
  },
  {
    key: "sub-wallet",
    label: "Sub-wallet",
    caption: "Allocated, paid, remaining.",
    analyticsScreen: "sub-wallet",
  },
  {
    key: "payout",
    label: "Payout",
    caption: "Set once, runs on schedule.",
    analyticsScreen: "payout",
  },
  {
    key: "activity",
    label: "Activity",
    caption: "What happened, in order.",
    analyticsScreen: "activity",
  },
];

/**
 * Screenshot showcase.
 *
 * Any file placed at public/images/app/<key>.png is rendered here automatically;
 * until then the same screens are drawn live from the product UI components, so
 * the section is complete either way.
 */
export function ScreenshotShowcase() {
  const assets = getAppAssets();

  return (
    <section id="screens" className="section">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="The app"
            title="Designed for your everyday money."
            description="Large, quiet screens with the numbers that matter in front. No dashboards full of charts you will never read twice."
          />
        </Reveal>

        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0">
          {screens.map((screen, index) => (
            <Reveal
              key={screen.key}
              className={[
                "shrink-0 snap-center",
                index % 2 === 1 ? "lg:translate-y-7" : "",
              ].join(" ")}
              delay={index * 0.05}
              y={26}
            >
              <AppScreenshot
                screen={screen.analyticsScreen}
                src={assets.screenshots[screen.key]}
                label={screen.label}
                caption={screen.caption}
                width={236}
                priority={false}
              />
            </Reveal>
          ))}
        </div>

        <p className="t-small mt-12 max-w-[60ch] text-faint">
          {assets.hasRealScreenshots
            ? "Screens shown are captured from the Dispense mobile app."
            : "Screens shown are design-accurate previews of the Dispense app, rendered from the product design system pending final captures."}
        </p>
      </div>
    </section>
  );
}
