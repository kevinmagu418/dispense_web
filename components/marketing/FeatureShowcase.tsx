import Link from "next/link";

import { features, type Feature } from "@/lib/content/product";

import { FeatureVisual } from "./FeatureVisuals";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ArrowUpRightIcon, WalletIcon } from "./app-ui/icons";

function FeatureIcon({ visual }: { visual: Feature["visual"] }) {
  if (visual === "wallet") return <WalletIcon width={17} height={17} className="text-brand" />;
  if (visual === "activity") return <ArrowUpRightIcon width={17} height={17} className="text-brand" />;
  return <span aria-hidden="true" className="size-2 rounded-full bg-brand" />;
}

function FeatureCard({ feature }: { feature: Feature }) {
  const isLarge = feature.size === "large";

  return (
    <Link
      href={`/features#${feature.id}`}
      data-analytics="feature_interaction"
      data-analytics-label={feature.title}
      className="group relative flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 transition-[transform,border-color,box-shadow] duration-400 ease-out hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_30px_70px_-50px_rgba(10,16,32,0.6)] focus-visible:-translate-y-1 sm:p-7 lg:p-8"
    >
      <span className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-[11px] bg-brand-tint">
          <FeatureIcon visual={feature.visual} />
        </span>
        <h3 className={isLarge ? "t-h3 text-ink" : "t-h4 text-ink"}>{feature.title}</h3>
      </span>

      <p className={isLarge ? "t-body mt-4 max-w-[42ch]" : "t-small mt-3"}>{feature.summary}</p>

      <div className={isLarge ? "mt-8" : "mt-5"}>
        <FeatureVisual visual={feature.visual} />
      </div>

      <span className="mt-auto pt-5 text-[0.8125rem] font-semibold text-brand-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        Read more
        <span aria-hidden="true"> →</span>
      </span>
    </Link>
  );
}

/** Asymmetric bento grid — deliberately not six identical SaaS cards. */
export function FeatureShowcase() {
  return (
    <section id="features" className="section">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="What Dispense does"
            title="Built from five things, done properly."
            description="Everything in the app answers one of two questions: how much do I have, and where does it need to go? Nothing here exists for the sake of a longer feature list."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-6 lg:gap-6">
          {features.map((feature) => (
            <Reveal
              key={feature.id}
              className={feature.size === "large" ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
