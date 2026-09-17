import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { CTAButton } from "@/components/marketing/CTAButton";
import { EditorialNote } from "@/components/marketing/EditorialNote";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SectionTransition } from "@/components/marketing/SectionTransition";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { featuredFaqs } from "@/lib/content/faq";
import { faqSchema, graph, pageMetadata, softwareApplicationSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getAppAssets } from "@/lib/site-assets";

/* Below-the-fold interactive sections are code-split; they still render on the
   server, so their content stays in the HTML for crawlers. */
const MoneyFlow = dynamic(() => import("@/components/marketing/MoneyFlow").then((m) => m.MoneyFlow));
const ProductStory = dynamic(() =>
  import("@/components/marketing/ProductStory").then((m) => m.ProductStory),
);
const ScreenshotShowcase = dynamic(() =>
  import("@/components/marketing/ScreenshotShowcase").then((m) => m.ScreenshotShowcase),
);
const VideoDemo = dynamic(() =>
  import("@/components/marketing/VideoDemo").then((m) => m.VideoDemo),
);

export const metadata: Metadata = pageMetadata({
  title: "Dispense — Organize Your Money Around Your Life",
  description:
    "Dispense is a personal money app that keeps your everyday balance in one place, then separates it into sub-wallets for rent, transport, groceries and savings — so you always know what is available and what is already committed.",
  path: "/",
  keywords: [
    "personal finance app",
    "money management",
    "sub-wallets",
    "budgeting",
    "digital wallet",
    "organize rent and transport money",
  ],
});

export default function HomePage() {
  const assets = getAppAssets();

  return (
    <>
      <HeroSection />
      <TrustStrip />

      <MoneyFlow />

      <SectionTransition label="The product" />

      <FeatureShowcase />

      <ProductStory />

      <ScreenshotShowcase />

      <EditorialNote />

      <VideoDemo
        videoSrc={assets.demoVideo}
        posterSrc={assets.demoVideoPoster}
        embedUrl={siteConfig.assets.demoEmbedUrl}
      />

      <section id="faq" className="section-tight">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Questions"
              title="The short answers."
              description="If something is not explained here, the full FAQ covers setup, payouts, platforms and data."
            />
            <div>
              <FAQAccordion items={featuredFaqs} defaultOpenId={featuredFaqs[0]?.id} />
              <div className="mt-7">
                <CTAButton href="/faq" variant="secondary" size="sm">
                  Read all questions
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />

      <JsonLd
        id="dispense-home-schema"
        json={graph(softwareApplicationSchema(), faqSchema(featuredFaqs))}
      />
    </>
  );
}
