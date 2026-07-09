import './globals.css';
import Script from 'next/script';
import ThemeToggle from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'URL Bundle Creator | Share multiple links with one link',
  description: 'Create a clean, shareable page for your useful links. Perfect for teachers, developers, and creators.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SessionProvider>
          <Navbar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
