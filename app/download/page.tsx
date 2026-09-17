import type { Metadata } from "next";

import { TrackView } from "@/components/analytics/AnalyticsProvider";
import { CTAButton } from "@/components/marketing/CTAButton";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { PageHero } from "@/components/marketing/PageHero";
import { DispenseLogo } from "@/components/marketing/Logo";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";
import { QrPlaceholder } from "@/components/marketing/QrPlaceholder";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { WalletScreen } from "@/components/marketing/app-ui/screens";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CheckCircleIcon, DeviceIcon, LockIcon, MailIcon } from "@/components/marketing/app-ui/icons";
import { faqs } from "@/lib/content/faq";
import { absoluteUrl, breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Download Dispense — Your Everyday Money, Organized",
  description:
    "Get Dispense for Android and iOS. Store links, the waitlist and everything you need before your first wallet setup — in one place.",
  path: "/download",
  keywords: [
    "download Dispense",
    "personal finance app download",
    "money management app",
    "budgeting app Android iOS",
  ],
});

const platformContent = {
  android: {
    name: "Android",
    detail: "Runs on current Android releases. Store listing not published yet.",
    url: siteConfig.download.androidUrl,
    available: siteConfig.download.hasAndroid,
    event: "android_download_click",
    buttonLabel: "Download for Android",
  },
  ios: {
    name: "iOS",
    detail: "Runs on current iOS releases. Store listing not published yet.",
    url: siteConfig.download.iosUrl,
    available: siteConfig.download.hasIos,
    event: "ios_download_click",
    buttonLabel: "Download for iPhone",
  },
} as const;

export default function DownloadPage() {
  const downloadFaqs = faqs.filter((item) =>
    [
      "where-can-i-download-dispense",
      "what-platforms-are-supported",
      "how-do-i-create-an-account",
    ].includes(item.id),
  );
  const waitlistHref = `mailto:${siteConfig.supportEmail}?subject=Join%20the%20Dispense%20waitlist`;
  const storeLinksLive = siteConfig.download.hasAndroid || siteConfig.download.hasIos;

  return (
    <>
      <TrackView event="download_page_view" />

      <PageHero
        eyebrow="Download"
        title="Take Dispense with you."
        description="Dispense is a mobile app: your wallet, sub-wallets, payouts and activity travel with you. Set it up once and it keeps the schedule you gave it."
        aside={
          <PhoneMockup width={252} glow>
            <WalletScreen />
          </PhoneMockup>
        }
      >
        <CTAButton
          href={waitlistHref}
          event="waitlist_join_click"
          external
          ariaLabel="Join the Dispense waitlist by email"
        >
          Join the waitlist
        </CTAButton>
        <CTAButton href="#platforms" variant="secondary">
          See availability
        </CTAButton>
      </PageHero>

      <div className="container-x">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Download", path: "/download" }]} />
      </div>

      <section id="platforms" className="scroll-mt-28 py-14 lg:py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <div className="flex flex-col gap-5">
              {(Object.keys(platformContent) as Array<keyof typeof platformContent>).map((key) => {
                const platform = platformContent[key];
                return (
                  <Reveal key={key}>
                    <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                      <div className="flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-brand-tint">
                          <DeviceIcon width={19} height={19} className="text-brand" />
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <h2 className="t-h4 text-ink">{platform.name}</h2>
                          <p className="t-small max-w-[34ch]">{platform.detail}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                        {platform.available ? (
                          <CTAButton
                            href={platform.url}
                            event={platform.event}
                            external
                            size="sm"
                          >
                            {platform.buttonLabel}
                          </CTAButton>
                        ) : (
                          <>
                            <span className="pill">
                              <span aria-hidden="true" className="size-1.5 rounded-full bg-faint" />
                              Not yet available
                            </span>
                            <CTAButton
                              href={waitlistHref}
                              variant="secondary"
                              size="sm"
                              event="waitlist_join_click"
                              external
                            >
                              Get the link
                            </CTAButton>
                          </>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}

              <Reveal>
                <div className="flex flex-col gap-3 rounded-[20px] border border-dashed border-line bg-canvas-alt/40 p-6">
                  <h2 className="t-h4 text-ink">
                    {storeLinksLive ? "Also available by email" : "Before the stores go live"}
                  </h2>
                  <p className="t-body max-w-[58ch]">
                    {storeLinksLive
                      ? "Prefer a direct link? Email us and we will send over the same download links shown above."
                      : "There is no public listing to point you at yet, and we will not link one that does not exist. Send a message with the subject \u201cJoin the Dispense waitlist\u201d and you will get the download links the day they are published."}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <CTAButton
                      href={waitlistHref}
                      event="waitlist_join_click"
                      size="sm"
                      external
                    >
                      Join the waitlist
                    </CTAButton>
                    <CTAButton href={`mailto:${siteConfig.supportEmail}`} variant="secondary" size="sm" external>
                      Contact support
                    </CTAButton>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="flex flex-col gap-5">
              <Reveal>
                <QrPlaceholder
                  url={absoluteUrl("/download")}
                  badge={<DispenseLogo size="sm" />}
                />
              </Reveal>

              <Reveal delay={0.06}>
                <div className="rounded-[20px] border border-line bg-surface p-6">
                  <h2 className="t-h4 text-ink">What you will need</h2>
                  <ul className="mt-4 flex flex-col gap-3.5">
                    {[
                      { icon: MailIcon, text: "An email address you can access — it receives your one-time confirmation code." },
                      { icon: DeviceIcon, text: "The phone you intend to use, so the device can be verified during setup." },
                      { icon: LockIcon, text: "A PIN you will set yourself. It unlocks the app from then on." },
                      { icon: CheckCircleIcon, text: "An idea of the purposes you want to split your money into — you can change them later." },
                    ].map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        <item.icon width={17} height={17} className="mt-0.5 shrink-0 text-brand" />
                        <span className="text-[0.9375rem] leading-relaxed text-subtle">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line-soft py-16 lg:py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Before you install"
              title="Three questions people ask first."
              description="The full FAQ covers setup, payouts, security and how your data is handled."
            />
            <div>
              <FAQAccordion items={downloadFaqs} defaultOpenId={downloadFaqs[0]?.id} />
              <div className="mt-7">
                <CTAButton href="/faq" variant="secondary" size="sm">
                  Read the full FAQ
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        id="dispense-download-schema"
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Download", path: "/download" },
          ]),
        )}
      />
    </>
  );
}
