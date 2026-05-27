import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('index-ru.html');
export default async function Page() {
  return <LegacyPage filename="index-ru.html" />;
}
