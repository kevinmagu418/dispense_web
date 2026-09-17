import { siteConfig } from "@/lib/site-config";

import { CTAButton } from "./CTAButton";
import { PhoneMockup } from "./PhoneMockup";
import { PayoutScreen } from "./app-ui/screens";

/**
 * Closing section — the conclusion of the page's story rather than a repeat of
 * the hero. Deliberately the only full-dark section on the site.
 */
export function FinalCTA() {
  return (
    <section id="download-cta" className="relative overflow-hidden bg-night">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] glow-brand-dark"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-atmosphere-dark opacity-45"
        style={{
          maskImage: "radial-gradient(65% 60% at 60% 30%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(65% 60% at 60% 30%, #000 0%, transparent 78%)",
        }}
      />

      <div className="container-x relative py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-20">
          <div className="max-w-[34rem]">
            <span className="pill border-white/15 bg-white/[0.06] text-white/75">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              Download Dispense
            </span>

            <h2 className="t-h2 mt-7 text-white">
              Your money has somewhere to go.
              <br className="hidden sm:block" /> Give it a plan.
            </h2>

            <p className="t-lead mt-6 max-w-[46ch] text-white/65">
              Set up your wallet, create the sub-wallets that match your month, and let the payouts
              run on the dates you chose. Rent covered, transport limited, savings untouched.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton href="/download" event="final_cta_download_click">
                Download Dispense
              </CTAButton>
              <CTAButton href="/how-it-works" variant="ghost-dark">
                See how it works
              </CTAButton>
            </div>

            <p className="t-small mt-6 text-white/45">{siteConfig.download.socialProofPlaceholder}</p>
          </div>

          <div className="justify-self-center lg:justify-self-end">
            <PhoneMockup width={278}>
              <PayoutScreen />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
