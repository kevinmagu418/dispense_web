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
import { MailIcon } from "@/components/marketing/app-ui/icons";

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
          <div className="group relative w-full max-w-[22rem] overflow-hidden rounded-[24px] border border-[#dce7fb] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_58%,#f3f7ff_100%)] p-6 shadow-[0_18px_45px_-34px_rgba(21,101,255,0.34),0_2px_8px_-4px_rgba(10,16,32,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#bfd3f7] hover:shadow-[0_24px_58px_-34px_rgba(21,101,255,0.42),0_8px_18px_-12px_rgba(10,16,32,0.16)] motion-reduce:transition-none motion-reduce:hover:transform-none">
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand/[0.07] blur-2xl" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#1565ff_0.7px,transparent_0.7px)] [background-size:18px_18px] [mask-image:linear-gradient(135deg,black,transparent_65%)]" />
            <span className="relative z-10 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand-dark/70">
              <span className="flex size-8 items-center justify-center rounded-[10px] border border-brand/15 bg-[linear-gradient(145deg,#f7faff_0%,#e7f0ff_100%)] text-brand shadow-[0_8px_18px_-12px_rgba(21,101,255,0.7)]">
                <MailIcon width={16} height={16} />
              </span>
              Personal help
            </span>
            <span className="relative z-10 mt-5 block text-[1.125rem] font-bold tracking-[-0.02em] text-ink">Still stuck?</span>
            <p className="t-body relative z-10 mt-2.5 text-[0.9375rem] leading-relaxed">
              Support answers by email. Tell us what you were trying to do and which screen you were
              on — it makes the reply much faster.
            </p>
            <div className="relative z-10 mt-6 flex flex-col gap-2.5">
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
