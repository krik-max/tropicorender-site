import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('app.html');
export default async function Page() {
  return <LegacyPage filename="app.html" />;
}
