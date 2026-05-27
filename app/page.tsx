import { LegacyPage, makeLegacyMetadata } from './_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('index.html');
export default async function Page() {
  return <LegacyPage filename="index.html" />;
}
