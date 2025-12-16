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
  {
    id: 'review-4',
    movieId: 'movie-10',
    userId: 'user-1',
    rating: 5,
    text: "Absolutely hilarious from start to finish. A modern comedy classic.",
    createdAt: "2024-05-22T11:00:00.000Z",
    user: mockUsers.find(u => u.id === 'user-1')!,
  },
  {
    id: 'review-5',
    movieId: 'movie-11',
    userId: 'user-2',
    rating: 4,
    text: "A heartwarming story with stunning animation. Great for the whole family.",
    createdAt: "2024-05-23T12:30:00.000Z",
    user: mockUsers.find(u => u.id === 'user-2')!,
  },
];

const calculateAvgRating = (movieId: string) => {
  const reviewsForMovie = mockReviews.filter(r => r.movieId === movieId);
  if (reviewsForMovie.length === 0) return 0;
  const totalRating = reviewsForMovie.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviewsForMovie.length).toFixed(1));
};

export const mockMovies: Movie[] = [
  // Existing Movies
  {
    id: 'movie-1',
    title: 'Stellar Odyssey',
    synopsis: 'In 2242, explorers seek a new home for humanity at the galaxy\'s edge, facing wonders and horrors beyond imagination.',
    releaseYear: 2023,
    posterId: 'movie-1',
    country: 'USA',
    director: 'Ava DuVernay',
    genres: ['Sci-Fi', 'Adventure'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-1'),
    avgRating: calculateAvgRating('movie-1'),
  },
  {
    id: 'movie-2',
    title: 'Echoes of the Past',
    synopsis: 'A historian uncovers a dangerous truth about a famous event, putting her life at risk from those who want the secret buried.',
    releaseYear: 2022,
    posterId: 'movie-2',
    country: 'UK',
    director: 'Clio Barnard',
    genres: ['Thriller', 'Mystery'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-2'),
    avgRating: calculateAvgRating('movie-2'),
  },
  {
    id: 'movie-3',
    title: 'The Last Stand',
    synopsis: 'A retired soldier must protect his town from ruthless mercenaries, becoming the last line of defense.',
    releaseYear: 2024,
    posterId: 'movie-3',
    country: 'USA',
    director: 'S. Craig Zahler',
    genres: ['Action', 'Thriller'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-3'),
    avgRating: calculateAvgRating('movie-3'),
  },
  {
    id: 'movie-4',
    title: 'Cybernetic Dreams',
    synopsis: 'A detective hunts a rogue AI in a neon-drenched metropolis, blurring the line between human and machine.',
    releaseYear: 2021,
    posterId: 'movie-4',
    country: 'South Korea',
    director: 'Kim Jee-woon',
    genres: ['Sci-Fi', 'Cyberpunk'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-4'),
    avgRating: calculateAvgRating('movie-4'),
  },
  {
    id: 'movie-5',
    title: 'Whispers in the Woods',
    synopsis: 'A family lost in a haunted forest confronts a terrifying ancient entity as night falls.',
    releaseYear: 2020,
    posterId: 'movie-5',
    country: 'USA',
    director: 'Robert Eggers',
    genres: ['Horror', 'Supernatural'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-5'),
    avgRating: calculateAvgRating('movie-5'),
  },
  {
    id: 'movie-6',
    title: 'City of Laughs',
    synopsis: 'Two struggling comedians\' big break tests their friendship and sanity with the pressures of newfound fame.',
    releaseYear: 2024,
    posterId: 'movie-6',
    country: 'USA',
    director: 'Judd Apatow',
    genres: ['Comedy', 'Drama'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-6'),
    avgRating: calculateAvgRating('movie-6'),
  },
  // New Movies
  {
    id: 'movie-7',
    title: 'RRR',
    synopsis: 'A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspirational path of freedom against the despotic rule.',
    releaseYear: 2022,
    posterId: 'movie-7',
    country: 'India',
    director: 'S. S. Rajamouli',
    genres: ['Action', 'Drama'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-7'),
    avgRating: 4.8,
  },
  {
    id: 'movie-8',
    title: 'Parasite',
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    releaseYear: 2019,
    posterId: 'movie-8',
    country: 'South Korea',
    director: 'Bong Joon Ho',
    genres: ['Thriller', 'Comedy', 'Drama'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-8'),
    avgRating: 4.9,
  },
  {
    id: 'movie-9',
    title: 'Dune: Part Two',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    releaseYear: 2024,
    posterId: 'movie-9',
    country: 'USA',
    director: 'Denis Villeneuve',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-9'),
    avgRating: 4.7,
  },
  {
    id: 'movie-10',
    title: '3 Idiots',
    synopsis: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots".',
    releaseYear: 2009,
    posterId: 'movie-10',
    country: 'India',
    director: 'Rajkumar Hirani',
    genres: ['Comedy', 'Drama'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-10'),
    avgRating: 4.9,
  },
  {
    id: 'movie-11',
    title: 'Spirited Away',
    synopsis: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    releaseYear: 2001,
    posterId: 'movie-11',
    country: 'USA', // Studio Ghibli is Japanese, but often distributed/categorized under USA for streaming
    director: 'Hayao Miyazaki',
    genres: ['Animation', 'Fantasy', 'Family'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-11'),
    avgRating: 4.8,
  },
  {
    id: 'movie-12',
    title: 'The Dark Knight',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseYear: 2008,
    posterId: 'movie-12',
    country: 'USA',
    director: 'Christopher Nolan',
    genres: ['Action', 'Crime', 'Drama'],
    reviews: mockReviews.filter(r => r.movieId === 'movie-12'),
    avgRating: 4.9,
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

// --- New Data Fetching Functions ---

export async function getMovies(): Promise<Movie[]> {
  // In a real app, this would fetch from Firestore
  return Promise.resolve(mockMovies);
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  // In a real app, this would fetch from Firestore
  return Promise.resolve(mockMovies.find(m => m.id === id));
}

export async function getTrendingMovies(): Promise<Movie[]> {
    // Mock logic: recent movies with high ratings
    const trending = mockMovies
        .filter(m => m.releaseYear >= 2022)
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5);
    return Promise.resolve(trending);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
    const topRated = mockMovies
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5);
    return Promise.resolve(topRated);
}

export async function getNewReleases(): Promise<Movie[]> {
    const newReleases = mockMovies
        .sort((a, b) => b.releaseYear - a.releaseYear)
        .slice(0, 5);
    return Promise.resolve(newReleases);
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
