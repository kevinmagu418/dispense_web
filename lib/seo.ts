import type { Metadata } from "next";

import { siteConfig } from "./site-config";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path used for the canonical URL and OG image lookup, e.g. "/features". */
  path: string;
  keywords?: readonly string[];
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

/**
 * One metadata builder for every route: title, description, canonical,
 * Open Graph and Twitter/X cards stay consistent by construction.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage,
  type = "website",
  publishedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const image =
    ogImage ??
    siteConfig.og.images[path as keyof typeof siteConfig.og.images] ??
    siteConfig.og.defaultImage;
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      locale: siteConfig.locale,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: imageUrl,
          width: siteConfig.og.width,
          height: siteConfig.og.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/* ---------------------------------------------------------------------------
   Structured data
   Only facts the project can stand behind: no ratings, prices, reviews,
   download counts or partnerships are ever emitted.
   ------------------------------------------------------------------------- */

type JsonLdNode = Record<string, unknown>;

export function organizationSchema(): JsonLdNode {
  const sameAs = Object.values(siteConfig.social).filter((url) => url.length > 0);

  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/marketing/dispense-logo.png"),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.supportEmail,
      },
    ],
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function softwareApplicationSchema(): JsonLdNode {
  return {
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}/#app`,
    name: siteConfig.name,
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Personal finance",
    operatingSystem: "Android, iOS",
    description: siteConfig.description,
    url: absoluteUrl("/download"),
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function faqSchema(items: ReadonlyArray<{ question: string; answer: string }>): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(
  trail: ReadonlyArray<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  image?: string;
}): JsonLdNode {
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    ...(post.image ? { image: absoluteUrl(post.image) } : {}),
  };
}

/** Wraps one or more nodes in a single @graph document. */
export function graph(...nodes: JsonLdNode[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
