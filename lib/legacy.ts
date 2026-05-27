import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type ParsedLegacy = {
  title: string;
  description: string;
  htmlLang: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogLocale?: string;
  ogLocaleAlt?: string;
  hreflang: { lang: string; href: string }[];
  cryptomus?: string;
  // Combined innerHTML: head's <style> blocks concatenated, then <body> content (scripts stripped)
  renderedHtml: string;
  // Inline <script> block contents extracted from body
  scripts: string[];
};

const attr = (re: RegExp, src: string) => src.match(re)?.[1];

export async function loadLegacy(filename: string): Promise<ParsedLegacy> {
  const filePath = path.join(process.cwd(), 'legacy', filename);
  const html = await readFile(filePath, 'utf-8');
  return parseLegacy(html);
}

export function parseLegacy(html: string): ParsedLegacy {
  const htmlLang = attr(/<html\s+lang="([^"]+)"/i, html) ?? 'en';
  const title = attr(/<title>([\s\S]*?)<\/title>/i, html)?.trim() ?? '';
  const description = attr(/<meta\s+name="description"\s+content="([^"]*)"/i, html) ?? '';
  const canonical = attr(/<link\s+rel="canonical"\s+href="([^"]*)"/i, html);
  const ogTitle = attr(/<meta\s+property="og:title"\s+content="([^"]*)"/i, html);
  const ogDescription = attr(/<meta\s+property="og:description"\s+content="([^"]*)"/i, html);
  const ogImage = attr(/<meta\s+property="og:image"\s+content="([^"]*)"/i, html);
  const ogUrl = attr(/<meta\s+property="og:url"\s+content="([^"]*)"/i, html);
  const ogLocale = attr(/<meta\s+property="og:locale"\s+content="([^"]*)"/i, html);
  const ogLocaleAlt = attr(/<meta\s+property="og:locale:alternate"\s+content="([^"]*)"/i, html);
  const cryptomus = attr(/<meta\s+name="cryptomus"\s+content="([^"]*)"/i, html);

  const hreflang: { lang: string; href: string }[] = [];
  const hreflangRe = /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi;
  let hm: RegExpExecArray | null;
  while ((hm = hreflangRe.exec(html)) !== null) {
    hreflang.push({ lang: hm[1], href: hm[2] });
  }

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headInner = headMatch?.[1] ?? '';
  const styleBlocks: string[] = [];
  const styleRe = /<style(?:\s+[^>]*)?>([\s\S]*?)<\/style>/gi;
  let sm: RegExpExecArray | null;
  while ((sm = styleRe.exec(headInner)) !== null) {
    styleBlocks.push(sm[1]);
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyInner = bodyMatch?.[1] ?? '';

  // Extract inline <script> contents (without src) and strip from body
  const scripts: string[] = [];
  bodyInner = bodyInner.replace(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi, (full, code) => {
    if (/\bsrc=/.test(full)) return full; // keep external scripts
    scripts.push(code);
    return '';
  });

  // Compose final renderable HTML: <style> blocks first (so CSS applies), then body content
  const stylesCombined = styleBlocks.map(s => `<style>${s}</style>`).join('\n');
  const renderedHtml = `${stylesCombined}\n${bodyInner}`;

  return {
    title,
    description,
    htmlLang,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogLocale,
    ogLocaleAlt,
    hreflang,
    cryptomus,
    renderedHtml,
    scripts,
  };
}

// Build a Next.js Metadata object from parsed legacy file.
export function legacyMetadata(p: ParsedLegacy) {
  const languages: Record<string, string> = {};
  for (const h of p.hreflang) languages[h.lang] = h.href;

  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: p.canonical,
      languages: Object.keys(languages).length ? languages : undefined,
    },
    openGraph: p.ogTitle
      ? {
          title: p.ogTitle,
          description: p.ogDescription,
          url: p.ogUrl,
          images: p.ogImage ? [p.ogImage] : undefined,
          locale: p.ogLocale,
          alternateLocale: p.ogLocaleAlt,
          type: 'website' as const,
        }
      : undefined,
    twitter: p.ogImage ? { card: 'summary_large_image' as const } : undefined,
    other: p.cryptomus ? { cryptomus: p.cryptomus } : undefined,
    icons: { icon: '/favicon.svg' },
  };
}
