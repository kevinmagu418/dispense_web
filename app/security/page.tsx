import type { Metadata } from "next";

import { CTAButton } from "@/components/marketing/CTAButton";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import {
  CheckCircleIcon,
  DeviceIcon,
  FingerprintIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
} from "@/components/marketing/app-ui/icons";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Dispense Security — How Your Account Is Protected",
  description:
    "What Dispense actually implements: email verification with one-time codes, device verification, a PIN lock, encrypted transport for app traffic and limited internal access to account data.",
  path: "/security",
  keywords: [
    "app security",
    "account protection",
    "PIN lock",
    "email verification",
    "data handling",
  ],
});

const measures = [
  {
    icon: MailIcon,
    title: "Email verification",
    body: "Every account is confirmed with a one-time code sent to the address you signed up with. The code is short-lived and can only be used once.",
  },
  {
    icon: DeviceIcon,
    title: "Device verification",
    body: "The device you set up is verified during registration, so signing in from somewhere new is a deliberate act rather than a silent one.",
  },
  {
    icon: LockIcon,
    title: "PIN lock",
    body: "You set a PIN after setup and it unlocks the app from then on. Nothing in the app is reachable without it.",
  },
  {
    icon: FingerprintIcon,
    title: "Biometric unlock where available",
    body: "On devices that support it, the app can be unlocked with the biometric security your phone already provides instead of typing the PIN.",
  },
  {
    icon: ShieldIcon,
    title: "Encrypted transport",
    body: "Traffic between the app and our services is sent over HTTPS, so credentials and account data are not readable in transit.",
  },
  {
    icon: CheckCircleIcon,
    title: "Limited internal access",
    body: "Account data is reached only where support or operations need it to answer a request — not opened for browsing.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="What we protect, and how."
        description="Security pages are usually written to sound impressive. This one is written to be accurate: it lists what is actually in place, and states plainly what Dispense does not claim."
      >
        <CTAButton href="/download">Download Dispense</CTAButton>
        <CTAButton href={`mailto:${siteConfig.supportEmail}?subject=Security%20question`} variant="secondary" external>
          Ask a security question
        </CTAButton>
      </PageHero>

      <div className="container-x">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Security", path: "/security" }]} />
      </div>

      <section className="py-14 lg:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="In place today"
              title="Six things protecting your account."
              description="Each of these is part of the flow you go through when you create and open a Dispense account."
            />
          </Reveal>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {measures.map((measure) => (
              <Reveal key={measure.title} as="li">
                <div className="flex h-full flex-col gap-4 rounded-[18px] border border-line bg-surface p-6">
                  <span className="flex size-10 items-center justify-center rounded-[12px] bg-brand-tint">
                    <measure.icon width={18} height={18} className="text-brand" />
                  </span>
                  <h3 className="t-h4 text-ink">{measure.title}</h3>
                  <p className="t-small">{measure.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line-soft py-16 lg:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <Reveal className="flex flex-col gap-6">
              <SectionHeading
                eyebrow="What we do not claim"
                title="No badges we have not earned."
              />
              <p className="t-body max-w-[48ch]">
                Claims like &ldquo;military-grade encryption&rdquo; and &ldquo;bank-level
                security&rdquo; are marketing language, not standards. You will not find them here,
                and you should be sceptical of them anywhere.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <ul className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6 sm:p-8">
                {[
                  "We do not publish a certification, licence or audit that has not been completed and confirmed.",
                  "We do not claim to be a bank, and we do not state which regulated providers are involved until that relationship can be disclosed accurately.",
                  "We do not list a security certification badge, an uptime figure or a compliance framework as a marketing point.",
                  "We do not store your PIN — it verifies you locally, it is not kept as readable text.",
                  "Where a regulated provider is involved in moving money, the details are disclosed inside the app before you rely on them.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-subtle">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line-soft py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col gap-8 rounded-[24px] border border-line bg-canvas-alt/50 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-[46ch]">
              <h2 className="t-h3 text-ink">Found something that looks wrong?</h2>
              <p className="t-body mt-3">
                Report it by email with as much detail as you can share — what you saw, when, and what
                you expected. We will confirm receipt and follow up.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton
                href={`mailto:${siteConfig.supportEmail}?subject=Security%20report`}
                external
                event="waitlist_join_click"
              >
                Report a security concern
              </CTAButton>
              <CTAButton href="/privacy" variant="secondary">
                Read the privacy policy
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />

      <JsonLd
        id="dispense-security-schema"
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Security", path: "/security" },
          ]),
        )}
      />
    </>
  );
}
