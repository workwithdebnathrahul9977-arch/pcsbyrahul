import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Try fetching dynamic PWA Logo
  let iconUrl = '/logo.png';
  try {
    const res = await fetch(`${apiUrl}/api/settings/PWA_LOGO`, { next: { revalidate: 60 } });
    const data = await res.json();
    if (data.value) {
      iconUrl = data.value;
    }
  } catch (error) {
    console.error('Failed to fetch PWA logo for manifest');
  }

  return {
    name: 'PhysChemia ERP',
    short_name: 'PhysChemia',
    description: 'PhysChemia Coaching Management System',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
