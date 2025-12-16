import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/reviews/StarRating';
import type { Review } from '@/lib/types';
import { User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
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
              <p className="font-semibold">{review.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
            <StarRating rating={review.rating} size={20} isInteractive={false} />
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{review.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
