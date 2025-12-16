import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, FileText, Vote, Flame } from 'lucide-react';

interface UserStatsProps {
    totalReviews: number;
    averageRating: number;
    pollsParticipated: number;
    activityStreak: number;
}

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function UserStats({ totalReviews, averageRating, pollsParticipated, activityStreak }: UserStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Reviews" value={totalReviews} icon={FileText} />
            <StatCard title="Average Rating" value={averageRating.toFixed(1)} icon={Star} />
            <StatCard title="Polls Voted" value={pollsParticipated} icon={Vote} />
            <StatCard title="Activity Streak" value={`${activityStreak} days`} icon={Flame} />
        </div>
    );
}
