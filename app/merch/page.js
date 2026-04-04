import { createBaseMetadata } from '../../lib/seo';
import MerchExperience from './MerchExperience';

export const metadata = createBaseMetadata({
  title: 'Merch - BNG NappSakk Official Merchandise',
  description: 'Shop official BNG NappSakk merchandise — tees, hoodies, hats, and limited drops.',
  path: '/merch',
  ogImage: '/images/hero-bg.jpg',
});

export default function MerchPage() {
  return <MerchExperience />;
}
