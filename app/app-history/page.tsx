import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('app-history.html');
export default async function Page() {
  return <LegacyPage filename="app-history.html" />;
}
