
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Medal, Crown, Vote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserBadgesProps {
    stats: {
        totalReviews: number;
        pollsParticipated: number;
    }
}

const allBadges = [
    {
        id: 'first-review',
        title: 'First Review',
        description: 'You wrote your first review!',
        icon: Award,
        condition: (stats: UserBadgesProps['stats']) => stats.totalReviews >= 1,
    },
    {
        id: 'reviewer',
        title: 'Reviewer',
        description: 'You have written 5 reviews.',
        icon: Medal,
        condition: (stats: UserBadgesProps['stats']) => stats.totalReviews >= 5,
    },
    {
        id: 'top-reviewer',
        title: 'Top Reviewer',
        description: 'Awarded for having a top-rated review.',
        icon: Crown,
        condition: () => false, // To be implemented
    },
    {
        id: 'poll-addict',
        title: 'Poll Addict',
        description: 'You voted in over 10 polls.',
        icon: Vote,
        condition: (stats: UserBadgesProps['stats']) => stats.pollsParticipated >= 10,
    },
    {
        id: 'verified-critic',
        title: 'Verified Critic',
        description: 'A special status for trusted reviewers.',
        icon: ShieldCheck,
        condition: () => false, // To be implemented
    },
];


export default function UserBadges({ stats }: UserBadgesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Badges</CardTitle>
        <CardDescription>Your collection of achievements on Cinepedia.</CardDescription>
      </CardHeader>
      <CardContent>
         <TooltipProvider>
            <div className="flex flex-wrap gap-4 md:gap-6">
                {allBadges.map(badge => {
                    const hasBadge = badge.condition(stats);
                    return (
                        <Tooltip key={badge.id}>
                            <TooltipTrigger asChild>
                                <div className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-4 border rounded-lg w-28 h-28 text-center transition-all",
                                    hasBadge ? "border-primary/50 bg-primary/10 text-primary" : "border-dashed text-muted-foreground opacity-60"
                                )}>
                                    <badge.icon className="w-8 h-8" />
                                    <span className="text-xs font-semibold">{badge.title}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{badge.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
