import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import PopupModal from '../components/PopupModal';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  let favicon = '/favicon.ico';
  let ogImage = '/logo.png';
  
  try {
    const [favRes, ogRes] = await Promise.all([
      fetch(`${apiUrl}/api/settings/SITE_FAVICON`, { next: { revalidate: 60 } }),
      fetch(`${apiUrl}/api/settings/SITE_OG_IMAGE`, { next: { revalidate: 60 } })
    ]);
    
    const favData = await favRes.json();
    const ogData = await ogRes.json();
    
    if (favData.value) favicon = favData.value;
    if (ogData.value) ogImage = ogData.value;
  } catch (error) {
    console.error("Failed to fetch dynamic metadata");
  }

  return {
    title: 'PhysChemia With Sumel Sir',
    description: 'Learn Physics and Chemistry with Sumel Sir',
    icons: {
      icon: favicon,
    },
    openGraph: {
      images: [ogImage],
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased selection:bg-red-500 selection:text-white`}>
        <Toaster position="top-right" />
        <PopupModal />
        {children}
        <Script
          id="pwa-sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
