'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchClient from '@/components/search/SearchClient';
import { MoviesGridSkeleton } from '@/components/movies/MoviesGrid';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return <SearchClient query={query} />;
}

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<MoviesGridSkeleton />}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
