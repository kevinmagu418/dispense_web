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
    label: "Verified identity",
    body: "Every account is confirmed with a one-time code sent to the address you signed up with. The code is short-lived and can only be used once.",
  },
  {
    icon: DeviceIcon,
    title: "Device verification",
    label: "Protected device",
    body: "The device you set up is verified during registration, so signing in from somewhere new is a deliberate act rather than a silent one.",
  },
  {
    icon: LockIcon,
    title: "PIN lock",
    label: "Private access",
    body: "You set a PIN after setup and it unlocks the app from then on. Nothing in the app is reachable without it.",
  },
  {
    icon: FingerprintIcon,
    title: "Biometric unlock where available",
    label: "Phone-level security",
    body: "On devices that support it, the app can be unlocked with the biometric security your phone already provides instead of typing the PIN.",
  },
  {
    icon: ShieldIcon,
    title: "Encrypted transport",
    label: "Secure in transit",
    body: "Traffic between the app and our services is sent over HTTPS, so credentials and account data are not readable in transit.",
  },
  {
    icon: CheckCircleIcon,
    title: "Limited internal access",
    label: "Need-to-know access",
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
            {measures.map((measure, index) => (
              <Reveal key={measure.title} as="li">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#dce7fb] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_58%,#f3f7ff_100%)] p-6 shadow-[0_18px_45px_-34px_rgba(21,101,255,0.34),0_2px_8px_-4px_rgba(10,16,32,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#bfd3f7] hover:shadow-[0_24px_58px_-34px_rgba(21,101,255,0.42),0_8px_18px_-12px_rgba(10,16,32,0.16)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:p-7">
                  <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand/[0.07] blur-2xl" />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#1565ff_0.7px,transparent_0.7px)] [background-size:18px_18px] [mask-image:linear-gradient(135deg,black,transparent_62%)]" />
                  <span aria-hidden="true" className="relative z-10 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand-dark/70">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand/20 bg-white/80 text-[0.625rem] tabular-nums text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    Account layer
                  </span>
                  <span className="relative z-10 mt-6 flex size-14 items-center justify-center rounded-[17px] border border-[#cfe0fc] bg-[linear-gradient(145deg,#f7faff_0%,#e7f0ff_100%)] text-brand shadow-[0_10px_24px_-14px_rgba(21,101,255,0.72),inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                    <measure.icon width={25} height={25} strokeWidth={1.65} />
                  </span>
                  <h3 className="relative z-10 mt-5 text-[1.0625rem] font-bold leading-snug tracking-[-0.015em] text-ink">{measure.title}</h3>
                  <p className="t-small relative z-10 mt-2.5 leading-relaxed">{measure.body}</p>
                  <span className="relative z-10 mt-auto flex items-center gap-1.5 pt-7 text-[0.75rem] font-bold text-brand-dark">
                    {measure.label}
                    <span aria-hidden="true" className="text-[0.9rem] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none">→</span>
                  </span>
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
              <div className="group relative overflow-hidden rounded-[24px] border border-[#dce7fb] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_58%,#f3f7ff_100%)] p-6 shadow-[0_18px_45px_-34px_rgba(21,101,255,0.34),0_2px_8px_-4px_rgba(10,16,32,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#bfd3f7] hover:shadow-[0_24px_58px_-34px_rgba(21,101,255,0.42),0_8px_18px_-12px_rgba(10,16,32,0.16)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:p-8">
                <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-brand/[0.07] blur-3xl" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#1565ff_0.7px,transparent_0.7px)] [background-size:18px_18px] [mask-image:linear-gradient(135deg,black,transparent_68%)]" />
                <div className="relative z-10 flex items-center gap-2 border-b border-brand/10 pb-5">
                  <span className="flex size-9 items-center justify-center rounded-[11px] border border-brand/15 bg-[linear-gradient(145deg,#f7faff_0%,#e7f0ff_100%)] text-brand shadow-[0_8px_18px_-12px_rgba(21,101,255,0.7)]">
                    <ShieldIcon width={17} height={17} />
                  </span>
                  <span>
                    <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand-dark/70">Clear boundaries</span>
                    <span className="mt-0.5 block text-[0.8125rem] font-semibold text-ink">What Dispense will not claim</span>
                  </span>
                </div>
              <ul className="relative z-10 mt-5 flex flex-col gap-3.5">
                {[
                  "We do not publish a certification, licence or audit that has not been completed and confirmed.",
                  "We do not claim to be a bank, and we do not state which regulated providers are involved until that relationship can be disclosed accurately.",
                  "We do not list a security certification badge, an uptime figure or a compliance framework as a marketing point.",
                  "We do not store your PIN — it verifies you locally, it is not kept as readable text.",
                  "Where a regulated provider is involved in moving money, the details are disclosed inside the app before you rely on them.",
                ].map((item, index) => (
                  <li key={item} className="flex items-start gap-3 rounded-[14px] border border-brand/10 bg-white/65 px-3.5 py-3 transition-colors duration-300 hover:border-brand/20 hover:bg-white/90 motion-reduce:transition-none">
                    <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-brand-tint text-[0.625rem] font-bold tabular-nums text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-0.5 text-[0.9375rem] leading-relaxed text-subtle">{item}</span>
                  </li>
                ))}
              </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line-soft py-14 lg:py-20">
        <div className="container-x">
          <div className="group relative flex flex-col gap-8 overflow-hidden rounded-[24px] border border-[#dce7fb] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_58%,#f3f7ff_100%)] p-8 shadow-[0_18px_45px_-34px_rgba(21,101,255,0.34),0_2px_8px_-4px_rgba(10,16,32,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#bfd3f7] hover:shadow-[0_24px_58px_-34px_rgba(21,101,255,0.42),0_8px_18px_-12px_rgba(10,16,32,0.16)] motion-reduce:transition-none motion-reduce:hover:transform-none lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 size-72 rounded-full bg-brand/[0.07] blur-3xl" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#1565ff_0.7px,transparent_0.7px)] [background-size:18px_18px] [mask-image:linear-gradient(135deg,black,transparent_68%)]" />
            <div className="relative z-10 max-w-[46ch]">
              <span className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand-dark/70">
                <span className="flex size-8 items-center justify-center rounded-[10px] border border-brand/15 bg-[linear-gradient(145deg,#f7faff_0%,#e7f0ff_100%)] text-brand shadow-[0_8px_18px_-12px_rgba(21,101,255,0.7)]">
                  <ShieldIcon width={16} height={16} />
                </span>
                Security support
              </span>
              <h2 className="mt-5 text-[1.375rem] font-bold tracking-[-0.025em] text-ink">Found something that looks wrong?</h2>
              <p className="t-body mt-3">
                Report it by email with as much detail as you can share — what you saw, when, and what
                you expected. We will confirm receipt and follow up.
              </p>
            </div>
            <div className="relative z-10 flex flex-col gap-3 sm:flex-row">
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
