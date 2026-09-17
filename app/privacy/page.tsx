import type { Metadata } from "next";

import { ConsentPreferencesButton } from "@/components/consent/ConsentPreferencesButton";
import { CTAButton } from "@/components/marketing/CTAButton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONSENT_VERSION } from "@/lib/consent";
import { breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy — Dispense",
  description:
    "What Dispense collects, why it is collected, how it is protected, who it is shared with, and how to ask about or delete your data.",
  path: "/privacy",
});

const lastUpdated = "September 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-12 sm:pt-36 lg:pt-40">
        <div className="container-narrow">
          <Breadcrumbs
            items={[{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }]}
          />
          <h1 className="t-h1 mt-8 max-w-[22ch]">Privacy policy</h1>
          <p className="t-lead mt-5">
            Plain-language explanation of what happens to your information when you use Dispense.
          </p>
          <p className="t-small mt-6 text-faint">Last updated: {lastUpdated}</p>

          <div className="mt-8 rounded-[16px] border border-dashed border-line bg-canvas-alt/50 p-5">
            <p className="t-small">
              <strong className="font-semibold text-ink">Review notice.</strong> This policy is a
              working draft prepared alongside the app. Company registration details, the data
              protection contact and jurisdiction-specific wording are finalised during legal review
              before launch, and this page will be updated then.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container-narrow prose-dispense">
          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Account details</strong> — the email address you register with, your name, and a
              phone number if you provide one during profile setup.
            </li>
            <li>
              <strong>Device information</strong> — identifiers and basic device details used to verify
              the device you signed up on and to protect the account from unexpected sign-ins.
            </li>
            <li>
              <strong>Your money records</strong> — the wallet and sub-wallets you create, the amounts
              you allocate, the payout schedules you configure, and the activity history those produce.
              This is your own instruction data about your own money.
            </li>
            <li>
              <strong>Support correspondence</strong> — messages you send us and our replies, kept so
              we can follow a request through to resolution.
            </li>
            <li>
              <strong>Technical logs</strong> — routine records of service requests used to keep the app
              running and to investigate faults and abuse.
            </li>
          </ul>

          <h2>Why we collect it</h2>
          <ul>
            <li>To create and secure your account, including verification and unlock.</li>
            <li>To show you your balances, sub-wallets and activity.</li>
            <li>To carry out the payouts you configure, through the provider you choose.</li>
            <li>To answer support requests and investigate problems.</li>
            <li>To meet legal and accounting obligations that apply to us.</li>
          </ul>

          <h2>How your information is protected</h2>
          <p>
            Traffic between the app and our services is sent over HTTPS. Access to account data is
            limited to the people who need it to operate and support the service. Your PIN is used to
            verify you and is not stored as readable text. More detail is on the{" "}
            <a href="/security">security page</a>.
          </p>

          <h2>Sharing</h2>
          <ul>
            <li>
              <strong>Payout providers</strong> — when you configure a payout, the details required to
              carry it out are passed to the provider you selected. Their own terms and privacy
              policies apply to that step.
            </li>
            <li>
              <strong>Service providers</strong> — hosting, email delivery and error monitoring
              suppliers that process data on our instructions so the app can run.
            </li>
            <li>
              <strong>Legal requirements</strong> — where we are required to disclose information by
              law or a valid legal process.
            </li>
          </ul>
          <p>
            We do not sell personal data, and we do not build advertising profiles from it. What this
            website may store in your browser is described under{" "}
            <a href="#cookies">cookies and similar technologies</a> below — nothing optional is
            stored until you choose it.
          </p>

          <h2 id="cookies">Cookies and similar technologies</h2>
          <p>
            This website asks before it measures anything. On your first visit a banner offers three
            equally weighted choices — accept optional cookies, reject them, or manage them
            individually — and your answer is remembered on this device so the banner does not
            reappear. You can change or withdraw that answer at any time using the cookie
            preferences control in the footer of any page.
          </p>

          <h3>Categories</h3>
          <ul>
            <li>
              <strong>Necessary — always active.</strong> Keeps the website working and stores the
              cookie decision itself, including which categories you accepted and when. These cannot
              be switched off because the site cannot operate correctly without them.
            </li>
            <li>
              <strong>Analytics — optional, off by default.</strong> Counts page views, calls to
              action, download clicks and video interactions so we can see which pages are useful.
              Events carry no names, email addresses, account details, financial values or form
              contents. Analytics is loaded only after you switch this on.
            </li>
            <li>
              <strong>Marketing — not in use.</strong> No advertising or cross-site tracking cookies
              are set by this website today. The category exists so that if campaign measurement is
              ever introduced, it starts from the same consent decision rather than being switched on
              quietly.
            </li>
          </ul>

          <h3>What is stored</h3>
          <p>
            Your decision is kept in this browser&rsquo;s local storage under a versioned record
            (<code>dispense.consent</code>, currently version{" "}
            <code>{CONSENT_VERSION}</code>) containing the categories you chose and the time of the
            decision. If storage is unavailable — for example in a private window or with storage
            blocked — the site keeps working and your choice applies for that visit only.
          </p>

          <h3>What is never collected</h3>
          <ul>
            <li>Passwords, PINs, authentication or session tokens.</li>
            <li>Account, wallet, balance, payout or any other financial data.</li>
            <li>Contents of forms, or anything you type into the site.</li>
            <li>
              Precise location. If you arrive from a campaign link, only the parameters in that link
              are recorded, never an address.
            </li>
          </ul>

          <h3>Changing your choice</h3>
          <p>
            Use the control below, or the same option in the footer of any page. Rejecting optional
            cookies does not restrict any part of the website.
          </p>
          <p>
            <ConsentPreferencesButton className="t-body link-underline font-semibold" />
          </p>

          <h2>Keeping and deleting</h2>
          <p>
            Account records are kept while your account is open and for the period afterwards that
            legal and accounting rules require. Support correspondence is kept while it is useful for
            continuity. You can ask us to delete your account and the personal data attached to it, and
            we will confirm what was removed and what has to be retained.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>Ask for a copy of the personal data we hold about you.</li>
            <li>Correct anything that is wrong or out of date.</li>
            <li>Ask us to delete your account and data.</li>
            <li>Withdraw consent for anything optional — for example support emails.</li>
          </ul>
          <p>
            Send any of these requests to{" "}
            <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> and we will
            respond from a person, not an autoresponder.
          </p>

          <h2>Children</h2>
          <p>
            Dispense is intended for adults managing their own money. It is not designed for, or
            directed at, children.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If the way we handle data changes, this page changes with it and the date at the top is
            updated. Material changes are also announced in the app.
          </p>

          <h2>Contact</h2>
          <p>
            Questions, requests and complaints:{" "}
            <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>. Postal and
            registered-address details will be added here once the company registration information is
            confirmed.
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            <CTAButton href="/terms" variant="secondary">
              Read the terms of use
            </CTAButton>
            <CTAButton href="/security">How we protect accounts</CTAButton>
          </div>
        </div>
      </section>

      <JsonLd
        id="dispense-privacy-schema"
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ]),
        )}
      />
    </>
  );
}
