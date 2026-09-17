import type { Metadata } from "next";

import { CTAButton } from "@/components/marketing/CTAButton";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";
import { StepSequence } from "@/components/marketing/StepSequence";
import { PayoutScreen } from "@/components/marketing/app-ui/screens";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How Dispense Works — Organize and Manage Your Money",
  description:
    "From creating an account to your first scheduled payout: how Dispense takes a single balance and turns it into labeled money for rent, transport, groceries and savings.",
  path: "/how-it-works",
  keywords: [
    "how to organize money",
    "budgeting app steps",
    "personal money management",
    "schedule payouts",
    "create sub-wallets",
  ],
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Five steps, then it runs itself."
        description="Setting up Dispense takes a few minutes. After that the value comes from the structure you built: amounts already assigned, payouts already scheduled, and one screen that tells you where you stand."
        aside={
          <div className="flex justify-end">
            <PhoneMockup width={240}>
              <PayoutScreen />
            </PhoneMockup>
          </div>
        }
      >
        <CTAButton href="/download">Download Dispense</CTAButton>
        <CTAButton href="/features" variant="secondary">
          Browse features
        </CTAButton>
      </PageHero>

      <div className="container-x">
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "How it works", path: "/how-it-works" }]}
        />
      </div>

      <StepSequence />

      <FinalCTA />

      <JsonLd
        id="dispense-how-it-works-schema"
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How it works", path: "/how-it-works" },
          ]),
        )}
      />
    </>
  );
}
