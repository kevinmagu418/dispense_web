import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTAButton } from "@/components/marketing/CTAButton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPost, getBlogPosts, parseMarkdown } from "@/lib/blog";
import { blogPostingSchema, breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

/**
 * No posts exist yet, so `generateStaticParams` returns an empty list and any
 * requested slug falls through to `notFound()` below. `dynamicParams` is left at
 * its default: setting it to `false` makes Next log an internal NoFallbackError
 * for every unknown slug before converting it to a 404.
 */
export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

type BlogPostRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return pageMetadata({
      title: "Article not found — Dispense",
      description: "The article you are looking for is not available.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: `${post.title} — Dispense`,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date || undefined,
    ogImage: post.cover,
  });
}

export default async function BlogPostPage({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const blocks = parseMarkdown(post.body);
  const otherPosts = getBlogPosts().filter((item) => item.slug !== post.slug);

  return (
    <>
      <article className="pt-32 pb-16 sm:pt-36 lg:pt-40">
        <div className="container-narrow">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />

          <header className="mt-8 flex flex-col gap-5">
            <span className="t-small flex flex-wrap items-center gap-x-3 text-faint">
              {post.date ? (
                <time dateTime={post.date}>{formatDate(new Date(post.date))}</time>
              ) : null}
              <span aria-hidden="true" className="size-1 rounded-full bg-line" />
              <span>{post.readingMinutes} min read</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-line" />
              <span>{post.author}</span>
            </span>
            <h1 className="t-h1 max-w-[26ch]">{post.title}</h1>
            {post.description ? <p className="t-lead">{post.description}</p> : null}
          </header>

          <div className="prose-dispense mt-12">
            {blocks.map((block, index) => {
              if (block.type === "heading") {
                return block.level === 2 ? (
                  <h2 key={index}>{block.text}</h2>
                ) : (
                  <h3 key={index}>{block.text}</h3>
                );
              }
              if (block.type === "list") {
                const Tag = block.ordered ? "ol" : "ul";
                return (
                  <Tag key={index}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </Tag>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={index}
                    className="border-l-2 border-brand/35 pl-5 italic text-subtle"
                  >
                    {block.text}
                  </blockquote>
                );
              }
              return <p key={index}>{block.text}</p>;
            })}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <CTAButton href="/download">Download Dispense</CTAButton>
            <CTAButton href="/blog" variant="secondary">
              All articles
            </CTAButton>
          </div>

          {otherPosts.length > 0 ? (
            <nav aria-label="More articles" className="mt-14">
              <h2 className="t-eyebrow text-faint">More articles</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {otherPosts.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="t-h4 text-ink transition-colors hover:text-brand-dark"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </article>

      <JsonLd
        id="dispense-blog-post-schema"
        json={graph(
          blogPostingSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            date: post.date,
            author: post.author,
            image: post.cover,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        )}
      />
    </>
  );
}
