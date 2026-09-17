import type { Metadata } from "next";

import { CTAButton } from "@/components/marketing/CTAButton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use — Dispense",
  description:
    "The terms that cover using the Dispense app: your account responsibilities, what the app does with the money you organise, payouts, availability and liability.",
  path: "/terms",
});

const lastUpdated = "September 2026";

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-12 sm:pt-36 lg:pt-40">
        <div className="container-narrow">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]} />
          <h1 className="t-h1 mt-8 max-w-[20ch]">Terms of use</h1>
          <p className="t-lead mt-5">
            What you can expect from Dispense, and what we expect from you when you use it.
          </p>
          <p className="t-small mt-6 text-faint">Last updated: {lastUpdated}</p>

          <div className="mt-8 rounded-[16px] border border-dashed border-line bg-canvas-alt/50 p-5">
            <p className="t-small">
              <strong className="font-semibold text-ink">Review notice.</strong> These terms are a
              working draft written to match the app as it exists. Governing-law wording, the
              registered company details and any regulated-provider disclosures are confirmed during
              legal review before launch, and this page will be updated then.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container-narrow prose-dispense">
          <h2>1. Agreement</h2>
          <p>
            By creating a Dispense account or using the Dispense app, you agree to these terms. If you
            do not agree with them, do not use the app.
          </p>

          <h2>2. Who can use Dispense</h2>
          <p>
            You must be at least 18 years old, or the age of majority where you live, and able to enter
            into a binding agreement. One account per person. You are responsible for the accuracy of
            the information you provide during registration and profile setup.
          </p>

          <h2>3. Your account and your PIN</h2>
          <ul>
            <li>Keep your PIN and device access to yourself. Anyone with them can use your account.</li>
            <li>
              Tell us promptly if you believe someone else has access to your account, and change your
              PIN.
            </li>
            <li>Do not share an account, or use someone else&rsquo;s details to create one.</li>
          </ul>

          <h2>4. What Dispense does with your money records</h2>
          <p>
            Dispense is a money organisation tool. It records the wallet balance you keep in it,
            separates amounts into the sub-wallets you create, and carries out the payouts you
            configure — at the amount, with the provider, and on the date and time you set. It does not
            decide where your money goes, and it does not move money that you have not configured.
          </p>
          <p>
            Amounts shown in the app, including balances, allocations and remaining amounts, are
            records of what you have entered and of the payouts that have run. Where a regulated
            provider is involved in moving money, their own terms apply to that part of the process,
            and the relevant relationship is disclosed in the app before you rely on it.
          </p>

          <h2>5. Payouts and schedules</h2>
          <ul>
            <li>You are responsible for the payout amounts, providers, dates and times you configure.</li>
            <li>
              A scheduled payout runs at the time you set it. If a provider is unavailable, a payout
              may be delayed or fail, and the status will show that in your activity history.
            </li>
            <li>
              Check your activity history after a payout is due. If something does not look right,
              contact support as soon as possible.
            </li>
          </ul>

          <h2>6. Fees and pricing</h2>
          <p>
            No fees are published on this website, because none have been finalised. If a fee ever
            applies to a Dispense feature, it will be shown in the app before you are charged, and it
            will not be introduced silently against a schedule you have already set.
          </p>

          <h2>7. Acceptable use</h2>
          <ul>
            <li>Do not use Dispense for anything unlawful, including money laundering or fraud.</li>
            <li>
              Do not attempt to break, overload, probe or reverse-engineer the service, or access
              accounts that are not yours.
            </li>
            <li>
              Do not use the app to mislead anyone about who you are or about what a payout is for.
            </li>
          </ul>

          <h2>8. Availability and changes</h2>
          <p>
            We aim to keep the app available and the schedules reliable, but we do not promise
            uninterrupted service. Features may be added, changed or retired. If a change materially
            affects a payout schedule you have configured, we will tell you before it takes effect.
          </p>

          <h2>9. Intellectual property</h2>
          <p>
            The Dispense name, the app, this website and their contents belong to Dispense or its
            licensors. You may use them as intended; you may not copy, resell or redistribute them
            without permission.
          </p>

          <h2>10. Liability</h2>
          <p>
            Dispense is provided on an &ldquo;as available&rdquo; basis. To the fullest extent
            permitted by law, we are not liable for indirect or consequential losses, or for losses
            caused by decisions you made about your own money or by a payout provider&rsquo;s failure
            to perform. Nothing in these terms excludes liability that cannot lawfully be excluded.
          </p>

          <h2>11. Ending your use</h2>
          <p>
            You can stop using Dispense and ask us to close your account at any time. We may suspend or
            close an account where these terms are broken, where we are required to by law, or where
            the account puts the service or other people at risk. Where it is lawful and practical, we
            will tell you why.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These terms are intended to be governed by the laws of Kenya, with disputes handled by the
            courts of Kenya. This will be confirmed in writing during legal review, before launch.
          </p>

          <h2>13. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            <CTAButton href="/privacy" variant="secondary">
              Read the privacy policy
            </CTAButton>
            <CTAButton href="/security">How we protect accounts</CTAButton>
          </div>
        </div>
      </section>

      <JsonLd
        id="dispense-terms-schema"
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms" },
          ]),
        )}
      />
    </>
  );
}
