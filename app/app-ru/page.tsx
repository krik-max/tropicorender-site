import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('app-ru.html');
export default async function Page() {
  return <LegacyPage filename="app-ru.html" />;
}
