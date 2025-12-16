export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Movie {
  id: number;
  tmdbId?: number;
  title: string;
  overview: string;
  synopsis?: string; // For compatibility
  release_date: string;
  releaseYear: number;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  avgRating: number;
  genres: { id: number, name: string }[];
  reviews: Review[]; // To be populated from Firestore
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  text: string;
  createdAt: string; // ISO string
  user: User;
}

export interface Poll {
  id: string;
  movieA: Movie;
  movieB: Movie;
  votesA: number;
  votesB: number;
  totalVotes: number;
}

export interface Vote {
  id:string;
  userId: string;
  pollId: string;
  votedForMovieId: string;
}

export interface UserActivity {
  type: 'review' | 'poll';
  date: string; // ISO string
  title: string;
  description: string;
  link: string;
}

export interface TMDBSearchResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
