
import type { Movie, Review, User, UserActivity, TMDBSearchResult } from '@/lib/types';

// --- TMDB API ---
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (path: string, params: Record<string, string> = {}) => {
    if (!TMDB_API_KEY) {
        throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not configured in .env file');
    }
    const url = new URL(`${TMDB_API_URL}${path}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    
    const res = await fetch(url.toString());
    if (!res.ok) {
        console.error(`TMDB API Error: ${res.status} ${res.statusText}`);
        return null;
    }
    return res.json();
};


// --- Data Fetching Functions ---

export async function getMovies(): Promise<Movie[]> {
  const data: TMDBSearchResult<Movie> = await fetchFromTMDB('/movie/popular');
  if (!data || !data.results) return [];
  return data.results.map(movie => ({
    ...movie,
    // Add any necessary transformations here
    releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0,
    avgRating: movie.vote_average,
    reviews: [], // Reviews will be fetched separately from Firestore
  }));
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  const movie: Movie = await fetchFromTMDB(`/movie/${id}`);
  if (!movie) return undefined;
  
  // In a real app, reviews would be fetched from Firestore.
  // For now, we return the movie with an empty reviews array.
  return {
    ...movie,
    releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0,
    avgRating: movie.vote_average,
    reviews: [],
  };
}


// --- Mock Data (to be phased out) ---

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob', email: 'bob@example.com' },
  { id: 'user-3', name: 'Charlie', email: 'charlie@example.com' },
];

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    movieId: '27205', // Inception
    userId: 'user-2',
    rating: 5,
    text: "A masterpiece of science fiction. The visuals were breathtaking and the story was deeply moving. A must-see for any fan of the genre.",
    createdAt: "2024-05-20T14:48:00.000Z",
    user: mockUsers.find(u => u.id === 'user-2')!,
  },
];


export const mockUserActivity: UserActivity[] = [
    {
      type: 'review',
      date: '2024-05-19T10:00:00.000Z',
      title: 'Posted a review for Inception',
      description: 'Rated 5/5 stars',
      link: '/movies/27205',
    },
    {
      type: 'poll',
      date: '2024-05-18T15:30:00.000Z',
      title: 'Voted in a poll',
      description: 'Inception vs. The Dark Knight',
      link: '/polls',
    },
];


export async function getPoll(): Promise<{ poll: import('@/lib/types').Poll, userVote: string | null } | null> {
  const movies = await getMovies();
  if (movies.length < 2) return null;
  const movieA = movies[0];
  const movieB = movies[1];
  return Promise.resolve({
    poll: {
      id: 'poll-1',
      movieA,
      movieB,
      votesA: 150,
      votesB: 80,
      totalVotes: 230,
    },
    userVote: null,
  });
}
