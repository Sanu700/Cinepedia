
"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserStats from "./UserStats";
import UserReviews from "./UserReviews";
import UserActivity from "./UserActivity";
import { mockReviews, mockUserActivity } from "@/lib/data";
import { Loader2 } from "lucide-react";
import type { Review, UserActivity as UserActivityType } from "@/lib/types";
import UserBadges from "./UserBadges";

// In a real app, you would fetch this data from your backend based on the user's ID.
const getUserDashboardData = async (userId: string): Promise<{
    stats: { totalReviews: number, averageRating: number, pollsParticipated: number },
    reviews: Review[],
    activity: UserActivityType[]
}> => {
    // Mocking data fetching
    await new Promise(res => setTimeout(res, 500));
    
    const userReviews = mockReviews.filter(r => r.userId === userId);
    const avgRating = userReviews.length > 0 ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length : 0;
    
    return {
        stats: {
            totalReviews: userReviews.length,
            averageRating: avgRating,
            pollsParticipated: 12, // mock data
        },
        reviews: userReviews,
        activity: mockUserActivity,
    }
}


export default function DashboardClient() {
  const { user, isUserLoading: loading } = useUser();
  const router = useRouter();
  
  // A placeholder state for dashboard data
  const [dashboardData, setDashboardData] = useState<Awaited<ReturnType<typeof getUserDashboardData>> | null>(null);

  useEffect(() => {
    // Wait until the loading is finished before checking for a user.
    if (!loading) {
      if (!user) {
        // If not loading and no user, then redirect.
        router.push('/login');
      } else {
        // If there is a user, fetch their data.
        getUserDashboardData(user.uid).then(setDashboardData);
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !dashboardData) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-bold">Welcome, {user.displayName}!</h1>
        <p className="mt-2 text-lg text-muted-foreground">Here's a summary of your activity on Cinepedia.</p>
      </div>

      <UserStats {...dashboardData.stats} />
      
      <UserBadges stats={dashboardData.stats} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <UserReviews reviews={dashboardData.reviews} />
        </div>
        <div>
            <UserActivity activities={dashboardData.activity} />
        </div>
      </div>
    </div>
  );
}
