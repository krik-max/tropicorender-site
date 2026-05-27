import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('auth.html');
export default async function Page() {
  return <LegacyPage filename="auth.html" />;
}
