'use client';

import { useState, useEffect } from 'react';
import { searchMovies } from '@/lib/data';
import type { Movie } from '@/lib/types';
import MoviesGrid from '@/components/movies/MoviesGrid';
import { MoviesGridSkeleton } from '@/components/movies/MoviesGrid';

interface SearchClientProps {
  query: string;
}

export default function SearchClient({ query }: SearchClientProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchMovies(query).then((results) => {
        setMovies(results);
        setLoading(false);
      });
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-headline font-bold">Searching for "{query}"...</h1>
        <div className="mt-8">
            <MoviesGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
        <h1 className="text-3xl font-headline font-bold">
            {movies.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}
        </h1>
        <p className="mt-2 text-muted-foreground">
            {movies.length > 0 ? `Showing ${movies.length} movies.` : 'Try searching for something else.'}
        </p>

        <div className="mt-8">
            {movies.length > 0 && <MoviesGrid initialMovies={movies} />}
        </div>
    </div>
  );
}
