
'use client';

import type { Metadata } from 'next';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import './globals.css';
import VerificationBanner from '@/components/auth/VerificationBanner';
import Fab from '@/components/shared/Fab';
import { useState } from 'react';
import MovieSuggester from '@/components/suggester/MovieSuggester';

const metadata: Metadata = {
  title: 'Cinepedia',
  description: 'Your ultimate guide to movies and reviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [suggesterOpen, setSuggesterOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <FirebaseClientProvider>
          <Header />
          <VerificationBanner />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          <Fab onClick={() => setSuggesterOpen(true)} />
          <MovieSuggester open={suggesterOpen} onOpenChange={setSuggesterOpen} />
        </FirebaseClientProvider>
      </body>
    </html>
  );
