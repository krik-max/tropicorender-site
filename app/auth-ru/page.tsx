import { LegacyPage, makeLegacyMetadata } from '../_legacy-route';

export const generateMetadata = () => makeLegacyMetadata('auth-ru.html');
export default async function Page() {
  return <LegacyPage filename="auth-ru.html" />;
}
