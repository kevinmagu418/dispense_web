import type { Metadata } from "next";

import { CTAButton } from "@/components/marketing/CTAButton";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/content/faq";
import { breadcrumbSchema, faqSchema, graph, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Dispense FAQ — Questions About the App",
  description:
    "Answers about Dispense: what it is, how sub-wallets work, how payouts are scheduled, which platforms are supported, how to create an account and how to get help.",
  path: "/faq",
  keywords: [
    "Dispense FAQ",
    "what is a sub-wallet",
    "personal finance app questions",
    "money app support",
  ],
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered plainly."
        description="Everything on this page describes the app as it exists today. If an answer depends on something we cannot verify yet, it says so instead of guessing."
        aside={
          <div className="w-full max-w-[22rem] rounded-[20px] border border-line bg-surface p-6">
            <span className="t-eyebrow text-faint">Still stuck?</span>
            <p className="t-body mt-3">
              Support answers by email. Tell us what you were trying to do and which screen you were
              on — it makes the reply much faster.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <CTAButton href={`mailto:${siteConfig.supportEmail}`} size="sm" external>
                Contact support
              </CTAButton>
              <CTAButton href="/how-it-works" variant="secondary" size="sm">
                Read how it works
              </CTAButton>
            </div>
          </div>
        }
      >
        <CTAButton href="/download">Download Dispense</CTAButton>
        <CTAButton href="/security" variant="secondary">
          How we protect accounts
        </CTAButton>
      </PageHero>

      <div className="container-x">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      </div>

      <section className="py-14 lg:py-20">
        <div className="container-x">
          <FAQAccordion
            items={faqs}
            defaultOpenId={faqs[0]?.id}
            className="mx-auto max-w-[62rem]"
          />
        </div>
      </section>

      <FinalCTA />

      <JsonLd
        id="dispense-faq-schema"
        json={graph(
          faqSchema(faqs.map((item) => ({ question: item.question, answer: item.answer }))),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        )}
      />
    </>
  );
}
