import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('app-history-ru.html');
export default async function Page() {
  return <LegacyPage filename="app-history-ru.html" />;
}
