

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/reviews/StarRating';
import type { Review, User } from '@/lib/types';
import { User as UserIcon, Medal, Award, Vote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Spoiler from './Spoiler';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ReviewActions from './ReviewActions';

interface ReviewListProps {
  reviews: Review[];
}

const UserBadges = ({ user }: { user: User }) => {
  if (!user.stats) return null;

  const badges = [
    {
      id: 'reviewer',
      title: 'Reviewer (5+ reviews)',
      icon: Medal,
      condition: user.stats.totalReviews >= 5,
    },
    {
      id: 'poll-addict',
      title: 'Poll Addict (10+ votes)',
      icon: Vote,
      condition: user.stats.pollsParticipated >= 10,
    },
    {
      id: 'first-review',
      title: 'First Review',
      icon: Award,
      condition: user.stats.totalReviews >= 1 && user.stats.totalReviews < 5,
    },
  ];

  const earnedBadges = badges.filter(b => b.condition);

  if (earnedBadges.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5">
        {earnedBadges.map(badge => (
          <Tooltip key={badge.id}>
            <TooltipTrigger>
              <badge.icon className="w-4 h-4 text-amber-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{badge.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <Card key={review.id}>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <Avatar>
              {review.user.avatarUrl && <AvatarImage src={review.user.avatarUrl} alt={review.user.name} />}
              <AvatarFallback>
                {review.user.name ? review.user.name.charAt(0).toUpperCase() : <UserIcon />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{review.user.name}</p>
                <UserBadges user={review.user} />
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
            <StarRating rating={review.rating} size={20} isInteractive={false} />
          </CardHeader>
          <CardContent>
            {review.hasSpoiler ? (
              <Spoiler>
                <p className="text-foreground/90">{review.text}</p>
              </Spoiler>
            ) : (
              <p className="text-foreground/90">{review.text}</p>
            )}
             <ReviewActions reviewId={review.id} initialLikes={review.likes} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
