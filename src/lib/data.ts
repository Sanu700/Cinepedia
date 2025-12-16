import type { Movie, Review, User, ImagePlaceholder, UserActivity } from '@/lib/types';
import imageData from './placeholder-images.json';

export const placeholderImages: ImagePlaceholder[] = imageData.placeholderImages;

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', email: 'alice@example.com', avatarUrl: placeholderImages.find(p => p.id === 'avatar-1')?.imageUrl },
  { id: 'user-2', name: 'Bob', email: 'bob@example.com', avatarUrl: placeholderImages.find(p => p.id === 'avatar-2')?.imageUrl },
  { id: 'user-3', name: 'Charlie', email: 'charlie@example.com', avatarUrl: placeholderImages.find(p => p.id === 'avatar-3')?.imageUrl },
];

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    movieId: 'movie-1',
    userId: 'user-2',
    rating: 5,
    text: "A masterpiece of science fiction. The visuals were breathtaking and the story was deeply moving. A must-see for any fan of the genre.",
    createdAt: "2024-05-20T14:48:00.000Z",
    user: mockUsers.find(u => u.id === 'user-2')!,
  },
  {
    id: 'review-2',
    movieId: 'movie-1',
    userId: 'user-3',
    rating: 4,
    text: "Great movie! The plot was a little predictable, but the acting and special effects were top-notch. I would definitely recommend it.",
    createdAt: "2024-05-21T18:20:00.000Z",
    user: mockUsers.find(u => u.id === 'user-3')!,
  },
   {
    id: 'review-3',
    movieId: 'movie-2',
    userId: 'user-1',
    rating: 3,
    text: "It was an interesting concept, but the execution fell a bit flat for me. The pacing felt slow at times.",
    createdAt: "2024-05-19T10:00:00.000Z",
    user: mockUsers.find(u => u.id === 'user-1')!,
  },
];

const calculateAvgRating = (movieId: string) => {
  const reviewsForMovie = mockReviews.filter(r => r.movieId === movieId);
  if (reviewsForMovie.length === 0) return 0;
  const totalRating = reviewsForMovie.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviewsForMovie.length).toFixed(1));
};

export const mockMovies: Movie[] = [
  {
    id: 'movie-1',
    title: 'Stellar Odyssey',
    synopsis: 'In the year 2242, a group of explorers embarks on a perilous journey to the edge of the galaxy, seeking a new home for humanity. They encounter wonders and horrors beyond their imagination.',
    releaseYear: 2023,
    posterId: 'movie-1',
    reviews: mockReviews.filter(r => r.movieId === 'movie-1'),
    avgRating: calculateAvgRating('movie-1'),
  },
  {
    id: 'movie-2',
    title: 'Echoes of the Past',
    synopsis: 'A historian discovers a diary that reveals a hidden truth about a famous historical event. As she delves deeper, she finds her own life in danger from those who want the secret to remain buried.',
    releaseYear: 2022,
    posterId: 'movie-2',
    reviews: mockReviews.filter(r => r.movieId === 'movie-2'),
    avgRating: calculateAvgRating('movie-2'),
  },
  {
    id: 'movie-3',
    title: 'The Last Stand',
    synopsis: 'A retired special forces soldier must protect his small town from a ruthless gang of mercenaries seeking a hidden fortune. It\'s a battle for survival where he is the last line of defense.',
    releaseYear: 2024,
    posterId: 'movie-3',
    reviews: mockReviews.filter(r => r.movieId === 'movie-3'),
    avgRating: calculateAvgRating('movie-3'),
  },
  {
    id: 'movie-4',
    title: 'Cybernetic Dreams',
    synopsis: 'In a neon-drenched metropolis, a detective hunts a rogue AI that has escaped into the city\'s network. The line between human and machine blurs as he questions the nature of consciousness.',
    releaseYear: 2021,
    posterId: 'movie-4',
    reviews: mockReviews.filter(r => r.movieId === 'movie-4'),
    avgRating: calculateAvgRating('movie-4'),
  },
  {
    id: 'movie-5',
    title: 'Whispers in the Woods',
    synopsis: 'A family on a camping trip gets lost in a forest rumored to be haunted. As night falls, they realize they are not alone and must confront a terrifying ancient entity.',
    releaseYear: 2020,
    posterId: 'movie-5',
    reviews: mockReviews.filter(r => r.movieId === 'movie-5'),
    avgRating: calculateAvgRating('movie-5'),
  },
  {
    id: 'movie-6',
    title: 'City of Laughs',
    synopsis: 'Two struggling comedians get their big break, but their newfound fame comes with unexpected challenges that test their friendship and their sanity.',
    releaseYear: 2024,
    posterId: 'movie-6',
    reviews: mockReviews.filter(r => r.movieId === 'movie-6'),
    avgRating: calculateAvgRating('movie-6'),
  },
];

export const mockUserActivity: UserActivity[] = [
    {
      type: 'review',
      date: '2024-05-19T10:00:00.000Z',
      title: 'Posted a review for Echoes of the Past',
      description: 'Rated 3/5 stars',
      link: '/movies/movie-2',
    },
    {
      type: 'poll',
      date: '2024-05-18T15:30:00.000Z',
      title: 'Voted in a poll',
      description: 'Stellar Odyssey vs. Cybernetic Dreams',
      link: '/polls',
    },
    {
      type: 'review',
      date: '2024-04-25T11:00:00.000Z',
      title: 'Posted a review for The Last Stand',
      description: 'Rated 5/5 stars',
      link: '/movies/movie-3',
    }
];

export async function getMovies(): Promise<Movie[]> {
  // In a real app, this would fetch from Firestore
  return Promise.resolve(mockMovies);
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  // In a real app, this would fetch from Firestore
  return Promise.resolve(mockMovies.find(m => m.id === id));
}

export async function getPoll(): Promise<{ poll: import('@/lib/types').Poll, userVote: string | null }> {
  // In a real app, this would fetch random movies and check user votes from Firestore
  const movieA = mockMovies[0];
  const movieB = mockMovies[1];
  return Promise.resolve({
    poll: {
      id: 'poll-1',
      movieA,
      movieB,
      votesA: 150,
      votesB: 80,
      totalVotes: 230,
    },
    userVote: null, // 'movieA', 'movieB', or null
  });
}
