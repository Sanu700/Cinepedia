import { getMovies } from '@/lib/data';
import MoviesGrid from '@/components/movies/MoviesGrid';

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Explore Movies</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our collection and find your next favorite film.
        </p>
      </div>

      <MoviesGrid movies={movies} />
    </div>
  );
}
