import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: "Afnan's Happy Birthday",
  description: 'A special birthday celebration app for Afnan!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Creepster&family=Dancing+Script:wght@400..700&family=Inter:wght@400;500;600;700&family=Orbitron:wght@400..900&family=Satisfy&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-ui antialiased">
        <div className="relative flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
