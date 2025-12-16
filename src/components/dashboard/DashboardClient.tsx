
"use client";

import { useUser, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserStats from "./UserStats";
import UserReviews from "./UserReviews";
import UserActivity from "./UserActivity";
import { Loader2 } from "lucide-react";
import type { Review, UserActivity as UserActivityType, Movie, Streak } from "@/lib/types";
import UserBadges from "./UserBadges";
import { collection, query, where, doc, getFirestore, getDoc } from "firebase/firestore";

interface ReviewWithMovie extends Review {
    movie?: Movie;
}

// This function now fetches the movie title for a review from the TMDB API
const fetchMovieForReview = async (review: Review): Promise<ReviewWithMovie> => {
    try {
        // In a real app with many reviews, you'd want to batch these requests
        // or have movie titles denormalized in your review documents.
        const res = await fetch(`https://api.themoviedb.org/3/movie/${review.movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch movie');
        const movieData = await res.json();
        return { ...review, movie: { ...movieData, title: movieData.title } };
    } catch (error) {
        console.error("Failed to fetch movie for review:", error);
        return { ...review, movie: { title: `Movie ID: ${review.movieId}` } as Movie }; // Fallback
    }
};


export default function DashboardClient() {
  const { user, isUserLoading: loading } = useUser();
  const router = useRouter();
  const firestore = getFirestore();

  const [reviewsWithMovies, setReviewsWithMovies] = useState<ReviewWithMovie[] | null>(null);

  // 1. Create a memoized query for the user's reviews
  const reviewsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'reviews'), where('userId', '==', user.uid));
  }, [firestore, user]);

  // 2. Use the useCollection hook to get real-time reviews
  const { data: reviews, isLoading: reviewsLoading } = useCollection<Review>(reviewsQuery);
  
  // 3. Create a memoized reference for the user's streak document
  const streakRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'streaks', user.uid);
  }, [firestore, user]);

  // 4. Use useDoc to get the streak data.
  // The error from this hook is handled by defaulting streak to 0.
  const { data: streakData, isLoading: streakLoading } = useDoc<Streak>(streakRef);

  // Effect to fetch movie details when reviews are loaded
  useEffect(() => {
    if (reviews) {
        Promise.all(reviews.map(fetchMovieForReview)).then(setReviewsWithMovies);
    }
  }, [reviews]);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  // 5. Calculate stats from live data
  const totalReviews = reviews?.length ?? 0;
  const averageRating = totalReviews > 0
    ? reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  // Polls participated is hard to query efficiently with the current structure.
  // We'll keep it mocked for now.
  const pollsParticipated = 12; 
  // Gracefully handle missing streak data by defaulting to 0.
  const activityStreak = streakData?.currentStreak ?? 0;

  // 6. Generate activity feed from live reviews
  const userActivities: UserActivityType[] = (reviews ?? [])
    .slice(0, 5) // Take the 5 most recent activities
    .map(review => ({
        type: 'review',
        date: review.createdAt,
        title: `Posted a review`,
        description: `Rated ${review.rating}/5 stars`,
        link: `/movies/${review.movieId}`,
    }));


  if (loading || !user || reviewsLoading || streakLoading || reviewsWithMovies === null) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const dashboardStats = {
      totalReviews,
      averageRating,
      pollsParticipated,
      activityStreak
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-bold">Welcome, {user.displayName}!</h1>
        <p className="mt-2 text-lg text-muted-foreground">Here's a summary of your activity on Cinepedia.</p>
      </div>

      <UserStats {...dashboardStats} />
      
      <UserBadges stats={dashboardStats} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <UserReviews reviews={reviewsWithMovies} />
        </div>
        <div>
            <UserActivity activities={userActivities} />
        </div>
      </div>
    </div>
  );
}
