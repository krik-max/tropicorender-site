'use client';

import { useEffect, useRef } from 'react';

type Props = {
  html: string;
  scripts: string[];
  htmlLang?: string;
};

export default function LegacyRenderer({ html, scripts, htmlLang }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (htmlLang) document.documentElement.lang = htmlLang;

    if (!ref.current) return;

    const injected: HTMLScriptElement[] = [];
    for (const code of scripts) {
      const s = document.createElement('script');
      s.text = code;
      document.body.appendChild(s);
      injected.push(s);
    }

    return () => {
      for (const s of injected) s.remove();
    };
  }, [scripts, htmlLang]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
