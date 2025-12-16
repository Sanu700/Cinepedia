import { getMovies } from '@/lib/data';
import MoviesGrid, { MoviesGridSkeleton } from '@/components/movies/MoviesGrid';
import { Suspense } from 'react';

async function Movies() {
  const movies = await getMovies();
  return <MoviesGrid initialMovies={movies} />;
}

export default function MoviesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Explore Popular Movies</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our collection of popular films from The Movie Database.
        </p>
      </div>

      <Suspense fallback={<MoviesGridSkeleton />}>
        <Movies />
      </Suspense>
    </div>
  );
}
