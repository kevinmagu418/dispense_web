import type { Metadata } from "next";
import Link from "next/link";

import { CTAButton } from "@/components/marketing/CTAButton";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPosts } from "@/lib/blog";
import { breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Dispense Blog — Practical Notes on Everyday Money",
  description:
    "Writing about organising everyday money: sub-wallets, rent and transport planning, scheduled payouts and the habits that make a month easier to manage.",
  path: "/blog",
});

const plannedTopics = [
  {
    title: "Organising money by purpose",
    summary:
      "How splitting a balance into rent, transport, groceries and savings changes the decisions you make in a week.",
  },
  {
    title: "Rent, on a schedule you do not have to think about",
    summary:
      "Why the date money leaves matters as much as the amount, and how to set a payout you can leave alone.",
  },
  {
    title: "Transport: the cost that hides in plain sight",
    summary:
      "Small daily amounts are the easiest money to lose track of. A visible weekly line changes that.",
  },
];

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes on everyday money."
        description="Practical writing about the money you handle every day — how to structure it, why purpose beats tracking, and what actually helps when a month gets tight."
      >
        <CTAButton href="/download">Download Dispense</CTAButton>
        <CTAButton href="/how-it-works" variant="secondary">
          See how it works
        </CTAButton>
      </PageHero>

      <div className="container-x">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      </div>

      <section className="py-14 lg:py-20">
        <div className="container-x">
          {posts.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    data-analytics="blog_post_open"
                    data-analytics-label={post.title}
                    className="group flex flex-col gap-3 py-8 transition-colors hover:text-brand-dark"
                  >
                    <span className="t-small flex flex-wrap items-center gap-x-3 text-faint">
                      {post.date ? <time dateTime={post.date}>{formatDate(new Date(post.date))}</time> : null}
                      <span aria-hidden="true" className="size-1 rounded-full bg-line" />
                      <span>{post.readingMinutes} min read</span>
                      {post.tags.length > 0 ? (
                        <>
                          <span aria-hidden="true" className="size-1 rounded-full bg-line" />
                          <span>{post.tags.join(", ")}</span>
                        </>
                      ) : null}
                    </span>
                    <h2 className="t-h3 max-w-[34ch] text-ink transition-colors group-hover:text-brand-dark">
                      {post.title}
                    </h2>
                    <p className="t-body max-w-[62ch]">{post.description}</p>
                    <span className="text-[0.8125rem] font-semibold text-brand-dark">
                      Read the article<span aria-hidden="true"> →</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
              <Reveal className="flex flex-col gap-6">
                <div className="rounded-[24px] border border-dashed border-line bg-canvas-alt/40 p-8">
                  <span className="pill">No articles published yet</span>
                  <h2 className="t-h3 mt-5 text-ink">
                    The blog is built and waiting for its first piece.
                  </h2>
                  <p className="t-body mt-4 max-w-[48ch]">
                    There is nothing to read here yet, and inventing placeholder articles would waste
                    your time. The publishing pipeline — article layout, metadata, structured data,
                    sitemap entries and social cards — is in place and will switch on with the first
                    real post.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <CTAButton href="/how-it-works" size="sm">
                      Read how Dispense works instead
                    </CTAButton>
                    <CTAButton
                      href={`mailto:${siteConfig.supportEmail}?subject=Dispense%20blog`}
                      variant="secondary"
                      size="sm"
                      external
                    >
                      Suggest a topic
                    </CTAButton>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.06} className="flex flex-col gap-6">
                <SectionHeading
                  eyebrow="Planned topics"
                  title="What will be published here."
                  description="Themes already in progress — not published articles."
                />
                <ul className="flex flex-col gap-5">
                  {plannedTopics.map((topic) => (
                    <li
                      key={topic.title}
                      className="rounded-[18px] border border-line bg-surface p-6"
                    >
                      <h3 className="t-h4 text-ink">{topic.title}</h3>
                      <p className="t-small mt-2">{topic.summary}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      <FinalCTA />

      <JsonLd
        id="dispense-blog-schema"
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        )}
      />
    </>
  );
}
