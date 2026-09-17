import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          /* Keep private surfaces out of the index if they are ever added. */
          "/api/",
          "/admin/",
          "/drafts/",
          "/preview/",
          "/_next/static/chunks/",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
