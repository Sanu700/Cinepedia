export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  posterId: string;
  reviews: Review[];
  avgRating: number;
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
  id: string;
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

export interface ImagePlaceholder {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}
