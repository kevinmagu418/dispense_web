import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Content layer for /blog.
 *
 * Posts are plain markdown files with front matter in `content/blog/`. The site
 * ships with zero posts — no placeholder articles are invented — and the blog
 * index renders a composed empty state until real files are added.
 *
 * Adding a post:
 *   1. create content/blog/<slug>.md
 *   2. add front matter (title, description, date, author, optional cover)
 *   3. rebuild — the index, the post route, the sitemap and OG metadata follow.
 */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  cover?: string;
  tags: string[];
  readingMinutes: number;
  body: string;
};

const contentDir = join(process.cwd(), "content", "blog");

function parseFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source.trim() };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }

  return { data, body: source.slice(match[0].length).trim() };
}

function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function getBlogPosts(): BlogPost[] {
  if (!existsSync(contentDir)) return [];

  return readdirSync(contentDir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const source = readFileSync(join(contentDir, file), "utf8");
      const { data, body } = parseFrontMatter(source);

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "Dispense",
        cover: data.cover,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        readingMinutes: readingMinutes(body),
        body,
      } satisfies BlogPost;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function hasBlogPosts(): boolean {
  return getBlogPosts().length > 0;
}

/* ---------------------------------------------------------------------------
   Minimal markdown renderer — headings, paragraphs, lists, quotes, emphasis.
   Intentional: no MDX dependency until posts actually need one.
   ------------------------------------------------------------------------- */

export type MarkdownBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string };

export function parseMarkdown(body: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = body.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      blocks.push({ type: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        text: heading[2].trim(),
      });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line.trim());
    const ordered = /^\d+[.)]\s+(.*)$/.exec(line.trim());
    if (bullet || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push(((bullet ?? ordered) as RegExpExecArray)[1].trim());
      continue;
    }

    const quote = /^>\s+(.*)$/.exec(line.trim());
    if (quote) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", text: quote[1].trim() });
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return blocks;
}
