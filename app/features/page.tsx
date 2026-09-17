import type { Metadata } from "next";

import { CTAButton } from "@/components/marketing/CTAButton";
import { FeatureDetail } from "@/components/marketing/FeatureDetail";
import { FeatureVisual } from "@/components/marketing/FeatureVisuals";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/marketing/Reveal";
import {
  ActivityScreen,
  HomeScreen,
  PayoutScreen,
  SubWalletScreen,
  WalletScreen,
} from "@/components/marketing/app-ui/screens";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { features, futureCapabilities } from "@/lib/content/product";
import { demoProduct } from "@/lib/demo-data";
import { breadcrumbSchema, graph, pageMetadata, softwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dispense Features — Wallets, Sub-Wallets & Money Organization",
  description:
    "A closer look at what Dispense does: a personal wallet, purpose-based sub-wallets for rent, transport, groceries and savings, scheduled payouts, and a clear activity history.",
  path: "/features",
  keywords: [
    "sub-wallet app",
    "money organization app",
    "scheduled payouts",
    "personal wallet",
    "expense organization",
    "budgeting categories",
  ],
});

const visuals = {
  wallet: <PhoneMockup width={236}><WalletScreen /></PhoneMockup>,
  "sub-wallets": (
    <PhoneMockup width={236}>
      <SubWalletScreen wallet={demoProduct.subWallets[0]} />
    </PhoneMockup>
  ),
  "organised-spending": (
    <div className="w-full max-w-[26rem]">
      <FeatureVisual visual="organize" />
    </div>
  ),
  payouts: <PhoneMockup width={236}><PayoutScreen /></PhoneMockup>,
  activity: <PhoneMockup width={236}><ActivityScreen /></PhoneMockup>,
} as const;

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything Dispense does, and nothing it does not."
        description="Five capabilities, each one there because everyday money needs it: a wallet that states the truth, sub-wallets for the purposes you actually have, payouts that run on schedule, and a history you can read."
        aside={
          <PhoneMockup width={248} glow>
            <HomeScreen />
          </PhoneMockup>
        }
      >
        <CTAButton href="/download" event="download_page_view">
          Download Dispense
        </CTAButton>
        <CTAButton href="/how-it-works" variant="secondary">
          See how it works
        </CTAButton>
      </PageHero>

      <div className="container-x">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }]} />
      </div>

      {features.map((feature, index) => (
        <FeatureDetail
          key={feature.id}
          feature={feature}
          index={index}
          visual={visuals[feature.id as keyof typeof visuals]}
        />
      ))}

      <section className="border-t border-line-soft py-16 lg:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Not yet released"
              title="Being built, not being claimed."
              description="These are directions we are working on. They are not in the app today, and nothing on this site depends on them."
            />
          </Reveal>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {futureCapabilities.map((item) => (
              <Reveal key={item.title} as="li">
                <div className="flex h-full flex-col gap-3 rounded-[18px] border border-dashed border-line bg-canvas-alt/40 p-6">
                  <span className="pill w-fit">Coming later</span>
                  <h3 className="t-h4 text-ink">{item.title}</h3>
                  <p className="t-small">{item.summary}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />

      <JsonLd
        id="dispense-features-schema"
        json={graph(
          softwareApplicationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Features", path: "/features" },
          ]),
        )}
      />
    </>
  );
}
