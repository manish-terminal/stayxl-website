import { notFound } from 'next/navigation';
import { villas as staticVillas } from '../../data/villas';
import VillaClientPage from './VillaClientPage';

export function generateStaticParams() {
  return staticVillas.map((villa) => ({
    slug: villa.slug,
  }));
}

export default async function VillaDetailPage({ params }) {
  const { slug } = await params;
  const villa = staticVillas.find(v => v.slug === slug);

  if (!villa) {
    notFound();
  }

  return <VillaClientPage villa={villa} />;
}
