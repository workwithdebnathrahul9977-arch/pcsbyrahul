import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import PopupModal from '../components/PopupModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PhysChemia With Sumel Sir',
  description: 'Learn Physics and Chemistry with Sumel Sir',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased selection:bg-red-500 selection:text-white`}>
        <Toaster position="top-right" />
        <PopupModal />
        {children}
      </body>
    </html>
  );
}
