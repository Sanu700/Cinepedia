import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Vote, ArrowRight } from "lucide-react";
import type { UserActivity } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';

interface UserActivityProps {
  activities: UserActivity[];
}

const activityIcons = {
  review: <FileText className="h-4 w-4" />,
  poll: <Vote className="h-4 w-4" />,
};

export default function UserActivity({ activities }: UserActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A timeline of your recent contributions.</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-muted rounded-full p-2">
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.date), { addSuffix: true })}</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={activity.link}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recent activity to show.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
