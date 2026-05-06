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
  const staticVilla = staticVillas.find(v => v.slug === slug);

  if (!staticVilla) {
    notFound();
  }

  // Fetch live price and availability from backend
  let dynamicVilla = null;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    if (apiUrl) {
      const response = await fetch(`${apiUrl}/api/villas/${slug}`, {
        next: { revalidate: 60 } // Cache for 1 minute
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) dynamicVilla = data.data;
      }
    }
  } catch (e) {
    console.error(`Failed to fetch dynamic data for villa ${slug}`, e);
  }

  // Merge static data with live pricing
  const villa = dynamicVilla 
    ? { ...staticVilla, ...dynamicVilla } 
    : staticVilla;

  return <VillaClientPage villa={villa} />;
}
