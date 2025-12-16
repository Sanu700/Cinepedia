import MovieCard from '@/components/movies/MovieCard';
import { getMovies } from '@/lib/data';

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
