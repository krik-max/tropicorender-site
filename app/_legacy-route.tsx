import { loadLegacy, legacyMetadata } from '@/lib/legacy';
import LegacyRenderer from '@/components/LegacyRenderer';

export async function makeLegacyMetadata(filename: string) {
  const p = await loadLegacy(filename);
  return legacyMetadata(p);
}

export async function LegacyPage({ filename }: { filename: string }) {
  const p = await loadLegacy(filename);
  return <LegacyRenderer html={p.renderedHtml} scripts={p.scripts} htmlLang={p.htmlLang} />;
}
